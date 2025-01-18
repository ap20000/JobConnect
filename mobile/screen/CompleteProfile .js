import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CompleteProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const [profileData, setProfileData] = useState({
    name: '',
    skills: '',
    education: '',
    experience: '',
    location: '',
    image: '',
  });

  const handleChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://192.168.1.75:3001/user/register/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.navigate('Home'); // Redirect to the main app screen
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <StyledView className="flex-1 bg-white p-4">
      <ScrollView>
        <StyledText className="text-xl font-bold mb-6">Complete Your Profile</StyledText>

        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Name"
          value={profileData.name}
          onChangeText={(value) => handleChange('name', value)}
        />
        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Skills"
          value={profileData.skills}
          onChangeText={(value) => handleChange('skills', value)}
        />
        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Education"
          value={profileData.education}
          onChangeText={(value) => handleChange('education', value)}
        />
        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Experience"
          value={profileData.experience}
          onChangeText={(value) => handleChange('experience', value)}
        />
        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Location"
          value={profileData.location}
          onChangeText={(value) => handleChange('location', value)}
        />
        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Image URL"
          value={profileData.image}
          onChangeText={(value) => handleChange('image', value)}
        />

        <StyledTouchableOpacity onPress={handleSubmit} className="bg-blue-500 p-3 rounded">
          <StyledText className="text-white text-center">Submit</StyledText>
        </StyledTouchableOpacity>
      </ScrollView>
    </StyledView>
  );
};

export default CompleteProfile;
