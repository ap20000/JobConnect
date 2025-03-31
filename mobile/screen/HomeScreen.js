import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const HomeScreen = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);


  const navigation = useNavigation();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/user/job");
      
      // Sort jobs by the 'createdAt' or 'date' field in descending order
      const sortedJobs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Set only the latest 3 jobs
      setAllJobs(sortedJobs.slice(0, 3));
      
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

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Profile Section */}
      <StyledView className="p-4 flex-row items-center bg-gray-300">
        {/* Logo inside a circle */}
        <StyledView className="w-20 h-20 rounded-full bg-gray-500 mr-4">
          <Image source={require('./assets/handshake.png')} className="w-full h-full rounded-full" />
        </StyledView>
        <StyledView>
          <StyledText className="text-lg font-semibold">JobConnect</StyledText>
          <StyledText className="text-sm text-gray-700">Let’s get hired for the job you deserve</StyledText>
        </StyledView>
      </StyledView>

      {/* Search Bar */}
      <StyledView className="p-4">
        <StyledTextInput
          className="bg-white p-3 rounded-lg shadow-md"
          placeholder="Search"
        />
      </StyledView>

      {/* Job Categories */}
      <StyledView className="px-4">
        <StyledText className="text-lg font-bold">Category</StyledText>
        <StyledView className="flex-row mt-2">
          <StyledTouchableOpacity className="px-4 py-2 bg-black rounded-full mr-2">
            <StyledText className="text-white">All</StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity className="px-4 py-2 border border-gray-300 rounded-full mr-2">
            <StyledText>Front End</StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity className="px-4 py-2 border border-gray-300 rounded-full mr-2">
            <StyledText>Back End</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      {/* Latest Job Section */}
      <StyledText className="px-4 mt-4 text-lg font-bold">Latest Job match with you</StyledText>

      {loading ? (
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6A38C2" />
        </StyledView>
      ) : (
        <FlatList
          data={allJobs}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <StyledView className="p-4 border border-gray-300 rounded-lg bg-white shadow-md mb-4">
              <StyledText className="text-lg font-bold">{item.title}</StyledText>
              <StyledText className="text-sm text-gray-500">{item.companyName} - {item.location}</StyledText>
              <StyledView className="flex-row mt-2">
                <StyledTouchableOpacity className="px-3 py-1 border border-gray-300 rounded-full mr-2">
                  <StyledText className="text-gray-600">Remote</StyledText>
                </StyledTouchableOpacity>
              </StyledView>
              <StyledText className="mt-2 font-semibold">${item.salary}</StyledText>
              <StyledTouchableOpacity
                onPress={() => navigation.navigate("ApplyJob", { jobId: item._id })}
                className="mt-4 py-2 px-4 bg-black rounded-lg"
              >
                <StyledText className="text-white text-center">Apply</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          )}
        />
      )}

      {/* Trust-Building Section */}
      <StyledView className="p-4 mt-6 bg-white rounded-lg shadow-md">
        <StyledText className="text-lg font-bold">Trusted by Top Companies</StyledText>
        <StyledView className="flex-row justify-between mt-4">
          {/* Static Company Logos (Use real logos in production) */}
          <Image source={require('./assets/handshake.png')} className="w-20 h-20" />
          <Image source={require('./assets/handshake.png')} className="w-20 h-20" />
          <Image source={require('./assets/handshake.png')} className="w-20 h-20" />
        </StyledView>

        <StyledText className="text-lg font-semibold mt-6">What Our Users Are Saying</StyledText>
        <StyledView className="mt-4">
          <StyledText className="italic">"JobConnect made my job search so much easier! The platform is user-friendly, and I landed my dream job!"</StyledText>
          <StyledText className="mt-2 text-gray-500">- Sarah L., Software Developer</StyledText>
        </StyledView>

        {/* App Stats */}
        <StyledView className="mt-6">
          <StyledText className="font-semibold">Stats</StyledText>
          <StyledText className="text-sm text-gray-500">Over 10,000 job seekers have found jobs through JobConnect!</StyledText>
        </StyledView>
      </StyledView>
    </ScrollView>
  );
};

export default HomeScreen;
