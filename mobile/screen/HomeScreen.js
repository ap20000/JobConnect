import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const HomeScreen = () => {
  const [allJobs, setAllJobs] = useState([]);  // Store all jobs data
  const [loading, setLoading] = useState(true);  // Loading state

  const navigation = useNavigation();

  // Fetch all jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/user/job');
      setAllJobs(response.data);  // Store all jobs
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch jobs");
      setLoading(false);
    }
  };

  // Fetch jobs initially when component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <StyledView className="flex-1 bg-white">
      {/* Profile & Greeting Section */}
      <StyledView className="p-4 flex-row items-center">
        <StyledView className="w-10 h-20 rounded-full bg-gray-300 mr-4" />
        <StyledView>
          <StyledText className="text-lg font-semibold">Abhishek Patel</StyledText>
          <StyledText className="text-sm text-gray-500">Let’s get hired for the job you deserve</StyledText>
        </StyledView>
      </StyledView>

      {/* Top Latest Jobs Section */}
      <StyledText className="px-4 mt-4 text-lg font-semibold">Top Latest Jobs</StyledText>

      {loading ? (
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6A38C2" />
        </StyledView>
      ) : (
        <FlatList
          horizontal
          data={allJobs}  // Show all jobs
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <StyledView className="p-4 border border-gray-200 rounded-lg bg-white shadow-lg mr-4">
              <StyledText className="text-lg font-bold text-[#6A38C2]">{item.title}</StyledText>
              {/* <StyledText className="text-sm text-gray-500">{item.company.name}</StyledText> */}
              <StyledTouchableOpacity
                onPress={() => navigation.navigate("ApplyJob", { jobId: item._id })}
                className="mt-4 py-2 px-4 bg-[#6A38C2] rounded-lg"
              >
                <StyledText className="text-white text-center">Apply Now</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          )}
        />
      )}

      {/* Job Matches for You Section */}
      <StyledText className="px-4 mt-4 text-lg font-semibold">Job Matches for You</StyledText>

      {loading ? (
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6A38C2" />
        </StyledView>
      ) : (
        <FlatList
          horizontal
          data={allJobs}  // Show all jobs
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <StyledView className="p-4 border border-gray-200 rounded-lg bg-white shadow-lg mr-4">
              <StyledText className="text-lg font-bold text-[#6A38C2]">{item.title}</StyledText>
              {/* <StyledText className="text-sm text-gray-500">{item.company.name}</StyledText> */}
              <StyledTouchableOpacity
                onPress={() => navigation.navigate("ApplyJob", { jobId: item._id })}
                className="mt-4 py-2 px-4 bg-[#6A38C2] rounded-lg"
              >
                <StyledText className="text-white text-center">Apply Now</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          )}
        />
      )}
    </StyledView>
  );
};

export default HomeScreen;
