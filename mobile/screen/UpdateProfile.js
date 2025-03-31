import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { BASE_URL } from "../App.js"; // Adjust this path to your base URL

const UpdateProfile = ({ route }) => {
  const { user } = route.params;
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [location, setLocation] = useState(user.location || "");
  const [image, setImage] = useState(user.image || "");
  const [cv, setCv] = useState(user.cv || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      Alert.alert("Error", "No user data found!");
      navigation.goBack();
    }
  }, [user]);

  // Request permissions for image picker
  const requestImagePickerPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "You need to grant permission to access the media library.");
    }
  };

  const handleImagePick = async () => {
    // Request permissions if not already granted
    await requestImagePickerPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image Picker Result:", result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      console.log("Selected image URI:", selectedImageUri); // Log to check if URI is set
    } else {
      Alert.alert("Error", "No image selected or selection canceled.");
    }
  };

  // Updated CV pick function with debugging
  const handleCvPick = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf", // You can add other types like DOCX if needed
    });

    console.log("CV Pick Result:", result);  // Log the result to check the structure

    // Check if document selection was not canceled
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedCvUri = result.assets[0].uri;
      console.log("CV picked:", selectedCvUri); // Debugging log
      setCv(selectedCvUri); // Set the selected CV URI to state
    } else {
      Alert.alert("Error", "No CV selected or selection canceled.");
    }
  } catch (error) {
    console.error("Error picking CV:", error);
    Alert.alert("Error", "Failed to pick CV.");
  }
};


  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "You are not logged in!");
        return;
      }

      const formData = new FormData();
      if (image) {
        const imageName = image.split("/").pop();
        formData.append("image", {
          uri: image,
          type: "image/jpeg", // Adjust the mime type if needed
          name: imageName,
        });
      }
      if (cv) {
        const cvName = cv.split("/").pop();
        formData.append("cv", {
          uri: cv,
          type: "application/pdf", // Adjust mime type if needed (e.g., for DOCX)
          name: cvName,
        });
      }
      formData.append("name", name);
      formData.append("email", email);
      formData.append("location", location);

      const response = await axios.put(
        `${BASE_URL}/user/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");

        // Update the local image state with the new image URL from the server
        setImage(`${response.data.user.image}`);
        console.log("Updated Image URL:", response.data.user.image);
        setCv(`${response.data.user.cv}`);

        // Navigate to Profile screen with updated user data
        navigation.navigate("HomeTabs", {
          screen: "Profile", // Navigate directly to the Profile screen
          params: { updatedUser: response.data.user }, // Pass updated user data
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
      if (error.response) {
        Alert.alert("Error", `Server Error: ${error.response.status}`);
      } else if (error.request) {
        Alert.alert("Error", "Network Error: No response from server.");
      } else {
        Alert.alert("Error", `Unexpected Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <TouchableOpacity onPress={handleImagePick} style={{ alignItems: "center" }}>
        <Image
          source={{
            uri: image
              ? image
              : `${BASE_URL}/uploads/${user.image}?${new Date().getTime()}`,
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 20,
            borderWidth: 2,
            borderColor: "#ddd",
          }}
        />
        <Text>Change Profile Picture</Text>
      </TouchableOpacity>

      <Text>Name:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 10,
          marginBottom: 20,
        }}
        value={name}
        onChangeText={setName}
      />

      <Text>Email:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 10,
          marginBottom: 20,
        }}
        value={email}
        onChangeText={setEmail}
      />

      <Text>Location:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 10,
          marginBottom: 20,
        }}
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity onPress={handleCvPick} style={{ marginBottom: 20 }}>
        <Text>Pick a CV (PDF only)</Text>
      </TouchableOpacity>

      {cv ? (
        <Text>CV: {cv.split("/").pop()}</Text> // Display CV file name
      ) : (
        <Text>No CV selected</Text>
      )}
      
      <TouchableOpacity
        onPress={handleUpdateProfile}
        style={{
          backgroundColor: "#007bff",
          padding: 15,
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdateProfile;
