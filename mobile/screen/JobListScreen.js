import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { debounce } from "lodash"; // Import lodash debounce

const JobListScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch jobs from API with optional search query
  const fetchJobs = async (query = "") => {
    try {
      setLoading(true);
      const response = await axios.get(`/user/job?search=${query}`);
      setJobs(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid excessive API calls
  const debouncedSearch = debounce((query) => {
    fetchJobs(query);
  }, 500); // Wait 500ms before making API request

  // Update search term and trigger API call
  const handleSearch = (text) => {
    setSearchTerm(text);
    debouncedSearch(text);
  };

  useEffect(() => {
    fetchJobs(); // Fetch all jobs on first load
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderRadius: 5,
          backgroundColor: "#f0f0f0",
          marginBottom: 15,
        }}
      >
        <TextInput
          placeholder="Search jobs by title..."
          value={searchTerm}
          onChangeText={handleSearch} // Trigger search on text change
          style={{ flex: 1, fontSize: 16 }}
        />
      </View>

      {/* Job List */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 15,
                marginVertical: 10,
                borderRadius: 10,
                backgroundColor: "#fff",
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
              <Text>{item.company?.name} - {item.location}</Text>
              <Text>Salary: ${item.salary}</Text>

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
          )}
          ListEmptyComponent={<Text>No jobs available</Text>}
        />
      )}
    </SafeAreaView>
  );
};

export default JobListScreen;
