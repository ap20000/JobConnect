import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JobDetailScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const userId = await AsyncStorage.getItem("userId");

        const response = await axios.get(`/user/job/${jobId}`);
        setJob(response.data);

        const applicationResponse = await axios.get(`/user/job/${jobId}/applicationStatus`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHasApplied(applicationResponse.data.applied);

       

        setLoading(false);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch job details");
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, []);

  const handleSaveJob = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.post(
      `/user/save/${jobId}`, // Use jobId as a parameter in the URL
      {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsSaved(true);
      Alert.alert("Success", "Job saved successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save job");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!job) {
    return <Text>No job details available</Text>;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{job.title}</Text>
      <Text style={{ fontSize: 18, color: "#666" }}>{job.company} - {job.location}</Text>
      <Text style={{ fontSize: 16, marginVertical: 10 }}>{job.description}</Text>
      <Text>Salary: ${job.salary}</Text>
      <Text>Type: {job.employmentType}</Text>
      <Text>Skills Required: {job.skills.join(", ")}</Text>

      <TouchableOpacity
        onPress={() => {
          if (!hasApplied) {
            navigation.navigate("ApplyJobScreen", { jobId: job._id });
          }
        }}
        style={{
          marginTop: 15,
          backgroundColor: hasApplied ? "#6c757d" : "#28a745",
          padding: 10,
          borderRadius: 5,
        }}
        disabled={hasApplied}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          {hasApplied ? "You already applied for this job" : "Apply Now"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSaveJob}
        style={{
          marginTop: 15,
          backgroundColor: isSaved ? "#6c757d" : "#007bff",
          padding: 10,
          borderRadius: 5,
        }}
        disabled={isSaved}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          {isSaved ? "Job Saved" : "Save Job"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default JobDetailScreen;
