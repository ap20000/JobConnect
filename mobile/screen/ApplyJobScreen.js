import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ApplyJobScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [loading, setLoading] = useState(false);
  const [cvExists, setCvExists] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const userEmail = await AsyncStorage.getItem("userEmail"); // Retrieve email

      if (!token || !userEmail) {
        Alert.alert("Error", "You need to be logged in to apply for jobs.");
        return;
      }

      try {
        const response = await axios.get(`/user/users?email=${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data; // Axios automatically parses JSON

        if (data.cv) {
          setCvExists(true);
        } else {
          setCvExists(false);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setCvExists(false);
      }
    };

    checkUserProfile();
  }, []);

  const applyForJob = async () => {
    if (!cvExists) {
      Alert.alert("Error", "You must upload a CV in your profile before applying.");
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem("authToken");

    try {
      const response = await axios.post(
        "/user/applyJob",
        { jobId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      Alert.alert("Success", response.data.message);
      navigation.goBack();
    } catch (error) {
      console.error("Error applying for job:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to apply for the job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Apply for Job
      </Text>

      {!cvExists && (
        <Text style={{ color: "red", marginBottom: 10 }}>
          You need to upload a CV in your profile before applying.
        </Text>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: cvExists ? "#28A745" : "#6C757D",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          opacity: cvExists ? 1 : 0.6,
        }}
        onPress={applyForJob}
        disabled={!cvExists || loading}
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
