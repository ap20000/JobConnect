import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const CompanyHome = () => {
  const jobPosts = [
    { id: 1, title: "Frontend Developer", location: "Remote", applicants: 32 },
    { id: 2, title: "UX/UI Designer", location: "New York", applicants: 15 },
    { id: 3, title: "Backend Engineer", location: "San Francisco", applicants: 22 },
  ];

  return (
    <StyledView className="flex-1 bg-white">
      <StyledView className="p-4 bg-green-500">
        <StyledText className="text-white text-xl font-bold">Welcome, Company!</StyledText>
        <StyledText className="text-white mt-1">Manage your job listings</StyledText>
      </StyledView>

      <ScrollView className="flex-1 p-4">
        {jobPosts.map((job) => (
          <StyledPressable key={job.id} className="bg-gray-100 rounded-lg p-4 mb-4">
            <StyledText className="text-lg font-semibold">{job.title}</StyledText>
            <StyledText className="text-gray-600">Location: {job.location}</StyledText>
            <StyledText className="text-gray-500">Applicants: {job.applicants}</StyledText>

            <StyledView className="flex-row mt-3">
              <StyledPressable className="bg-blue-500 px-4 py-2 rounded mr-2">
                <StyledText className="text-white text-center">View</StyledText>
              </StyledPressable>
              <StyledPressable className="bg-red-500 px-4 py-2 rounded">
                <StyledText className="text-white text-center">Manage</StyledText>
              </StyledPressable>
            </StyledView>
          </StyledPressable>
        ))}
      </ScrollView>
    </StyledView>
  );
};

export default CompanyHome;
