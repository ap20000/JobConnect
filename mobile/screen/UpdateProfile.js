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
import { BASE_URL } from "../App.js"; // Adjust this path to your base URL

const UpdateProfile = ({ route }) => {
  const { user } = route.params;
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [location, setLocation] = useState(user.location || "");
  const [image, setImage] = useState(user.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      Alert.alert("Error", "No user data found!");
      navigation.goBack();
    }
  }, [user]);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image Picker Result:", result);

    // Check if the result is valid and has the image URI
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      console.log("Selected image URI:", selectedImageUri); // Log to check if URI is set
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
        setImage(`http://192.168.1.122:3001${response.data.user.image}`);

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
          source={{ uri: image ? image : `${BASE_URL}/uploads/${user.image}` }}
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
