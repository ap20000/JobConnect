import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CompleteProfile = ({ route, navigation }) => {
  const { userId } = route.params;

  const [profileData, setProfileData] = useState({
    name: "",
    skills: "",
    education: [{ school: "", degree: "", years: "" }],
    experience: [{ role: "", companyName: "", years: "" }],
    location: "",
    image: null, // Image URI
    cv: null, // CV URI
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "You need to allow access to photos.");
      }
    })();
  }, []);

  // Select Profile Image
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileData({ ...profileData, image: result.assets[0].uri });
    }
  };

  // Select CV File
  const selectCV = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf", // Allow only PDF files
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const cvUri = result.assets[0].uri;
      setProfileData((prevState) => ({
        ...prevState,
        cv: cvUri,
      }));
    }
  };

  // Handle input change for dynamic fields (education or experience)
  const handleFieldChange = (fieldType, index, key, value) => {
    const updatedData = [...profileData[fieldType]];
    updatedData[index][key] = value;
    setProfileData({ ...profileData, [fieldType]: updatedData });
  };

  // Add a new education or experience field
  const addField = (fieldType) => {
    const newField = fieldType === "education"
      ? { school: "", degree: "", years: "" }
      : { role: "", companyName: "", years: "" };

    setProfileData({
      ...profileData,
      [fieldType]: [...profileData[fieldType], newField],
    });
  };

  // Remove an education or experience field
  const removeField = (fieldType, index) => {
    const updatedData = profileData[fieldType].filter((_, i) => i !== index);
    setProfileData({ ...profileData, [fieldType]: updatedData });
  };

  // Submit Profile Data
  const handleSubmit = async () => {
    if (!profileData.name || !profileData.skills || !profileData.location) {
      Alert.alert("Error", "Please fill all required fields and upload your CV.");
      return;
    }
    if (!profileData.cv) {
      Alert.alert("Error", "Please upload your CV.");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Append form data fields
    formData.append("name", profileData.name);
    formData.append("skills", profileData.skills);
    formData.append("education", JSON.stringify(profileData.education));
    formData.append("experience", JSON.stringify(profileData.experience));
    formData.append("location", profileData.location);

    // Append image if exists
    if (profileData.image) {
      formData.append("image", {
        uri: profileData.image,
        name: "profile.jpg", // File name can be dynamic if needed
        type: "image/jpeg",
      });
    }

    // Append CV if exists
    if (profileData.cv) {
      formData.append("cv", {
        uri: profileData.cv,
        name: profileData.cv.split("/").pop(),
        type: "application/pdf",
      });
    }

    try {
      const response = await axios.post(
        `/user/completeProfile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      console.error("Error details:", error.response?.data);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-white p-4">
      <ScrollView>
        <StyledText className="text-xl font-bold mb-6">Complete Your Profile</StyledText>

          <View className="my-1 space-y-4">
            <TextInput className="border border-gray-300 p-4 rounded-md" placeholder="Full Name" value={profileData.name} onChangeText={(value) => setProfileData({ ...profileData, name: value })} />
            <View className="border border-gray-300 p-4 rounded-md flex-row justify-between items-center">
              <TextInput className="flex-1" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
              <Eye size={20} color="gray" />
            </View>
          </View>
        {/* Name */}
        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Name"
          value={profileData.name}
          onChangeText={(value) => setProfileData({ ...profileData, name: value })}
        />

        {/* Skills */}
        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Skills"
          value={profileData.skills}
          onChangeText={(value) => setProfileData({ ...profileData, skills: value })}
        />

        {/* Education */}
        <StyledText className="font-bold text-lg mb-2">Education</StyledText>
        {profileData.education.map((edu, index) => (
          <View key={`education-${index}`} className="mb-4">
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-2"
              placeholder="School"
              value={edu.school}
              onChangeText={(value) => handleFieldChange("education", index, "school", value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-2"
              placeholder="Degree"
              value={edu.degree}
              onChangeText={(value) => handleFieldChange("education", index, "degree", value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-2"
              placeholder="Years"
              value={edu.years}
              onChangeText={(value) => handleFieldChange("education", index, "years", value)}
            />
            {index > 0 && (
              <StyledTouchableOpacity
                onPress={() => removeField("education", index)}
                className="bg-red-500 p-2 rounded mb-2"
              >
                <StyledText className="text-white text-center">Remove Education</StyledText>
              </StyledTouchableOpacity>
            )}
          </View>
        ))}
        <StyledTouchableOpacity onPress={() => addField("education")} className="bg-green-500 p-3 rounded mb-4">
          <StyledText className="text-white text-center">Add More Education</StyledText>
        </StyledTouchableOpacity>

        {/* Experience */}
        <StyledText className="font-bold text-lg mb-2">Experience</StyledText>
        {profileData.experience.map((exp, index) => (
          <View key={`experience-${index}`} className="mb-4">
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-2"
              placeholder="Role"
              value={exp.role}
              onChangeText={(value) => handleFieldChange("experience", index, "role", value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-2"
              placeholder="Company"
              value={exp.companyName}
              onChangeText={(value) => handleFieldChange("experience", index, "companyName", value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-2"
              placeholder="Years"
              value={exp.years}
              onChangeText={(value) => handleFieldChange("experience", index, "years", value)}
            />
            {index > 0 && (
              <StyledTouchableOpacity
                onPress={() => removeField("experience", index)}
                className="bg-red-500 p-2 rounded mb-2"
              >
                <StyledText className="text-white text-center">Remove Experience</StyledText>
              </StyledTouchableOpacity>
            )}
          </View>
        ))}
        <StyledTouchableOpacity onPress={() => addField("experience")} className="bg-green-500 p-3 rounded mb-4">
          <StyledText className="text-white text-center">Add More Experience</StyledText>
        </StyledTouchableOpacity>

        {/* Location */}
        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Location"
          value={profileData.location}
          onChangeText={(value) => setProfileData({ ...profileData, location: value })}
        />

        {/* Profile Image */}
        <StyledTouchableOpacity onPress={selectImage} className="bg-blue-500 p-3 rounded mb-4">
          <StyledText className="text-white text-center">Select Profile Image</StyledText>
        </StyledTouchableOpacity>

        {/* CV */}
        <StyledTouchableOpacity onPress={selectCV} className="bg-blue-500 p-3 rounded mb-4">
          <StyledText className="text-white text-center">Upload CV</StyledText>
        </StyledTouchableOpacity>

        {/* Submit Button */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <StyledTouchableOpacity onPress={handleSubmit} className="bg-blue-500 p-3 rounded mb-4">
            <StyledText className="text-white text-center">Save Profile</StyledText>
          </StyledTouchableOpacity>
        )}
      </ScrollView>
    </StyledView>
  );
};

export default CompleteProfile;
