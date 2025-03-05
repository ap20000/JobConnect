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

const JobDetailScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/user/job/${jobId}`); // Update API URL
        setJob(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch job details");
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, []);

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
        onPress={() => navigation.navigate("ApplyJobScreen", { jobId: job._id })}
        style={{
          marginTop: 15,
          backgroundColor: "#28a745",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Apply Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default JobDetailScreen;
