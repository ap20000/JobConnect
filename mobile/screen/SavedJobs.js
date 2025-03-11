import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          Alert.alert("Error", "No token found, please log in again.");
          return;
        }

        const response = await axios.get("/user/saved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSavedJobs(response.data);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        Alert.alert("Error", "Failed to fetch saved jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        Saved Jobs
      </Text>
      {savedJobs.length > 0 ? (
        savedJobs.map((job) => (
          <View
            key={job._id}
            style={{
              marginVertical: 10,
              padding: 10,
              backgroundColor: "#f8f9fa",
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{job.title}</Text>
            <Text>{job.company} - {job.location}</Text>
            <Text>Salary: ${job.salary}</Text>
            <Text>Type: {job.employmentType}</Text>
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center", fontSize: 16 }}>No saved jobs found</Text>
      )}
    </ScrollView>
  );
};

export default SavedJobs;
