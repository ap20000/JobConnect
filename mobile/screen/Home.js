import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const JobSeekerHome = () => {
  const jobs = [
    { id: 1, title: "Software Engineer", company: "Tech Solutions", location: "Remote" },
    { id: 2, title: "Product Designer", company: "Design Hub", location: "New York" },
    { id: 3, title: "Data Analyst", company: "DataCorp", location: "San Francisco" },
  ];

  return (
    <StyledView className="flex-1 bg-white">
      <StyledView className="p-4 bg-blue-500">
        <StyledText className="text-white text-xl font-bold">Welcome, Job Seeker!</StyledText>
        <StyledText className="text-white mt-1">Find your next opportunity</StyledText>
      </StyledView>
      
      <ScrollView className="flex-1 p-4">
        {jobs.map((job) => (
          <StyledPressable key={job.id} className="bg-gray-100 rounded-lg p-4 mb-4">
            <StyledText className="text-lg font-semibold">{job.title}</StyledText>
            <StyledText className="text-gray-600">{job.company}</StyledText>
            <StyledText className="text-gray-500">{job.location}</StyledText>
          </StyledPressable>
        ))}
      </ScrollView>
    </StyledView>
  );
};

export default JobSeekerHome;
