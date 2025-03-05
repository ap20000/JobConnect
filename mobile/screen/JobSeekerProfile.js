import React, { useState } from 'react';
import { View, TextInput, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateProfile = ({ route, navigation }) => {
  const { email } = route.params; 
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [skills, setSkills] = useState('');
  const [resume, setResume] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('collegeName', collegeName);
    formData.append('year', year);
    formData.append('subject', subject);
    formData.append('skills', skills);
    formData.append('resume', resume);

    if (image) {
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('image', {
        uri: image,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      formData.append('email', email); // The email is passed from the Register screen

      const response = await axios.post("/user/profile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });

      Alert.alert("Profile created successfully!");
      navigation.navigate('Login');

    } catch (error) {
      Alert.alert("Failed to create profile", error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="College Name" value={collegeName} onChangeText={setCollegeName} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Year" value={year} onChangeText={setYear} keyboardType="numeric" style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Subject" value={subject} onChangeText={setSubject} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Skills" value={skills} onChangeText={setSkills} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Resume" value={resume} onChangeText={setResume} style={{ borderBottomWidth: 1, marginBottom: 10 }} />

      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />}

      <Button title="Submit Profile" onPress={handleSubmit} />
    </View>
  );
};

export default CreateProfile;
