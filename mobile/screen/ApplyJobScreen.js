import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ApplyJobScreen = ({ route, navigation }) => {
  const { jobId } = route.params; // Get Job ID passed from the listing screen
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to pick a CV file
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", // Restrict to PDF files
      });

      console.log("Document Picker Result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0]; // Get the first file from the assets array
        setCv(file);
        Alert.alert("File Selected", `You selected: ${file.name}`);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick the document.");
    }
  };

  // Function to apply for a job
  const applyForJob = async () => {
    if (!cv) {
      Alert.alert("Error", "Please select a CV before applying.");
      return;
    }

    setLoading(true);

    // Get the token from AsyncStorage
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      Alert.alert("Error", "You need to be logged in to apply for jobs.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("cv", {
      uri: cv.uri, // Extracted uri
      type: cv.mimeType, // Extracted mimeType
      name: cv.name, // Extracted name
    });

    console.log("Submitting FormData:", formData);

    try {
      const response = await fetch("http://192.168.1.122:3001/user/applyJob", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        Alert.alert("Success", data.message);
        navigation.goBack(); // Go back to the previous screen after success
      } else {
        Alert.alert("Error", data.message || "Failed to apply for the job.");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Apply for Job
      </Text>

      {/* Button to pick document */}
      <TouchableOpacity
        style={{
          backgroundColor: "#007BFF",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 10,
        }}
        onPress={pickDocument}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>
          {cv ? "Change CV" : "Upload CV (PDF)"}
        </Text>
      </TouchableOpacity>

      {/* Display selected file name */}
      {cv && <Text style={{ marginBottom: 10 }}>Selected File: {cv.name}</Text>}

      {/* Button to apply for the job */}
      <TouchableOpacity
        style={{
          backgroundColor: cv ? "#28A745" : "#6C757D",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          opacity: cv ? 1 : 0.6,
        }}
        onPress={applyForJob}
        disabled={!cv || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16 }}>Apply Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ApplyJobScreen;
