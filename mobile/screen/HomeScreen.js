import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const HomeScreen = () => {
  const [query, setQuery] = useState("");
  const [latestJobs, setLatestJobs] = useState([]);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/user/job'); // Ensure correct API URL
        const data = await response.json();
        if (response.ok) {
          setLatestJobs(data);
        } else {
          setError(data.message || "Error fetching jobs.");
        }
      } catch (error) {
        setError("Server error. Please try again later.");
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = latestJobs.filter((job) =>
    job.title.toLowerCase().includes(query.toLowerCase()) ||
    job.company.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <StyledView className="flex-1 bg-white">
      <StyledView className="p-4">
        <StyledText className="text-2xl font-bold text-center">Find Your Dream Job</StyledText>
        <StyledTextInput
          className="border border-gray-300 rounded-lg px-4 py-2 mt-3"
          placeholder="Search for jobs..."
          value={query}
          onChangeText={setQuery}
        />
      </StyledView>

      {error ? (
        <StyledView className="p-4">
          <StyledText className="text-red-500 text-center">{error}</StyledText>
        </StyledView>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <StyledView className="p-4 border border-gray-200 rounded-lg bg-white shadow-lg mb-3">
              <StyledText className="text-lg font-bold text-[#6A38C2]">{item.title}</StyledText>
              <StyledText className="text-sm text-gray-500">{item.company}</StyledText>
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
