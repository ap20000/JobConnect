import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import axios from "axios";

const JobListScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      const response = await axios.get("/user/job"); // Update API URL
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch jobs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderJobItem = ({ item }) => (
    <View
      style={{
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
      <Text style={{ fontSize: 14, color: "#666" }}>
        {item.company} - {item.location}
      </Text>
      <Text>Salary: ${item.salary}</Text>
      <Text>Type: {item.employmentType}</Text>
      <Text>Skills: {item.skills.join(", ")}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("JobDetailScreen", { jobId: item._id })}
        style={{
          marginTop: 10,
          backgroundColor: "#007BFF",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderJobItem}
          ListEmptyComponent={<Text>No jobs available</Text>}
        />
      )}
    </SafeAreaView>
  );
};

export default JobListScreen;
