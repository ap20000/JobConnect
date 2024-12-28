import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert, ActivityIndicator, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedLocation, setUpdatedLocation] = useState('');
  const [updatedImage, setUpdatedImage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        const token = await AsyncStorage.getItem('userToken');

        if (!email || !token) {
          Alert.alert("Error", "User not authenticated.");
          return;
        }

        const response = await axios.get(`http://192.168.1.81:3001/user/users/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
        console.log('Fetched Profile:', response.data); // Add this line
        setUpdatedName(response.data.name || '');
        setUpdatedLocation(response.data.location || '');
        setUpdatedImage(response.data.image || '');
      } catch (error) {
        Alert.alert("Error fetching profile", error.response?.data?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = profile.id; // Assuming profile has an _id field

      const response = await axios.put(`http://192.168.1.81:3001/user/users/${userId}`, {
        name: updatedName,
        location: updatedLocation,
        image: updatedImage,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data.updatedUser);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error updating profile", error.response?.data?.message || "An error occurred.");
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!profile) {
    return <Text>No profile data available.</Text>;
  }

  return (
    <View className="flex-1 p-5 bg-gray-100 items-center justify-center">
      <View className="w-11/12 bg-white rounded-lg shadow-md items-center pb-5">
        {/* Profile Image */}
        <Image
          source={{ uri: `http://192.168.1.81:3001/${profile.image}` }}
          className="w-32 h-32 rounded-full -mt-16 border-4 border-white"
        />

        {/* Profile Fields */}
        <View className="mt-5 px-5">
          <Text className="text-lg font-bold mb-1">Name: <Text className="font-normal">{profile.name || "Not available"}</Text></Text>
          <Text className="text-lg font-bold mb-1">Email: <Text className="font-normal">{profile.email || "Not available"}</Text></Text>
          <Text className="text-lg font-bold mb-1">Location: <Text className="font-normal">{profile.location || "Not available"}</Text></Text>
          <Text className="text-lg font-bold mb-1">Education: <Text className="font-normal">{profile.education || "Not available"}</Text></Text>
          <Text className="text-lg font-bold mb-1">Year: <Text className="font-normal">{profile.year || "Not available"}</Text></Text>
          <Text className="text-lg font-bold mb-1">Skills: <Text className="font-normal">{profile.skills?.join(', ') || "Not available"}</Text></Text>
        </View>

        {/* Update Button */}
        <Button title="Edit Profile" onPress={() => setIsEditing(true)} />

        {/* Update Form */}
        {isEditing && (
          <View className="mt-5 w-full px-5">
            <TextInput
              className="h-10 border border-gray-300 mb-3 p-2 rounded"
              placeholder="Update Name"
              value={updatedName}
              onChangeText={setUpdatedName}
            />
            <TextInput
              className="h-10 border border-gray-300 mb-3 p-2 rounded"
              placeholder="Update Location"
              value={updatedLocation}
              onChangeText={setUpdatedLocation}
            />
            <TextInput
              className="h-10 border border-gray-300 mb-3 p-2 rounded"
              placeholder="Update Image URL"
              value={updatedImage}
              onChangeText={setUpdatedImage}
            />
            <Button title="Save Changes" onPress={handleUpdateProfile} />
            <Button title="Cancel" onPress={() => setIsEditing(false)} />
          </View>
        )}
      </View>
    </View>
  );
};

export default Profile;
