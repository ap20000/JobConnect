import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator 
} from 'react-native';
import { styled } from 'nativewind';
import * as ImagePicker from 'expo-image-picker';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CompleteProfile = ({ route, navigation }) => {
  const { userId } = route.params;

  const [profileData, setProfileData] = useState({
    name: '',
    skills: '',
    location: '',
    image: null, // Change to null to store image URI
  });

  const [loading, setLoading] = useState(false);

  // Request Permissions for Image Picker
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'You need to allow access to photos.');
      }
    })();
  }, []);

  // Select Image from Gallery using Expo ImagePicker
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileData({ ...profileData, image: result.assets[0].uri });
    }
  };

  // Submit Profile Data
  const handleSubmit = async () => {
    if (!profileData.name || !profileData.skills || !profileData.location) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('skills', profileData.skills);
    formData.append('location', profileData.location);

    if (profileData.image) {
      formData.append('image', {
        uri: profileData.image,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      const response = await fetch(`http://192.168.1.122:3001/user/completeProfile/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.navigate('Login');
      } else {
        const errorResponse = await response.json();
        Alert.alert('Error', errorResponse?.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-white p-4">
      <ScrollView>
        <StyledText className="text-xl font-bold mb-6">Complete Your Profile</StyledText>

        {/* Name */}
        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Name"
          value={profileData.name}
          onChangeText={(value) => setProfileData({ ...profileData, name: value })}
        />

        {/* Skills */}
        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Skills"
          value={profileData.skills}
          onChangeText={(value) => setProfileData({ ...profileData, skills: value })}
        />

        {/* Location */}
        <StyledTextInput
          className="border border-gray-300 p-3 rounded mb-4"
          placeholder="Location"
          value={profileData.location}
          onChangeText={(value) => setProfileData({ ...profileData, location: value })}
        />

        {/* Image Selection */}
        <StyledTouchableOpacity onPress={selectImage} className="bg-blue-500 p-3 rounded mb-4">
          <StyledText className="text-white text-center">Select Image</StyledText>
        </StyledTouchableOpacity>

        {/* Display Selected Image */}
        {profileData.image ? (
          <Image source={{ uri: profileData.image }} className="w-32 h-32 rounded-full mx-auto mb-4" />
        ) : null}

        {/* Submit Button */}
        <StyledTouchableOpacity onPress={handleSubmit} className="bg-blue-500 p-3 rounded">
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <StyledText className="text-white text-center">Submit</StyledText>
          )}
        </StyledTouchableOpacity>
      </ScrollView>
    </StyledView>
  );
};

export default CompleteProfile;
