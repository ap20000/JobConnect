import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // or any other icon set

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Register = () => {
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    email: '',
    password: '',
    skills: '',
    image: '',
    companyName: '',
  });
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access camera roll is required!');
      }
    })();
  }, []);

  const handleCategorySelection = (selectedCategory) => {
    setCategory(selectedCategory);
    setFormData({
      name: '',
      userName: '',
      email: '',
      password: '',
      skills: '',
      image: '',
      companyName: '',
    });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      handleChange('image', result.assets[0].uri);
    } else {
      Alert.alert('Image selection canceled');
    }
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append('name', formData.name);
    form.append('userName', formData.userName);
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('category', category);
    form.append('skills', formData.skills);
    form.append('companyName', formData.companyName);

    // Append image if it exists
    if (imageUri) {
      const filename = imageUri.split('/').pop();
      const fileType = filename.split('.').pop();

      form.append('image', {
        uri: imageUri,
        name: filename,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await fetch('http://192.168.1.75:3001/user/register', {  // Adjust URL as needed
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        Alert.alert('Success', 'Registration successful');
        navigation.navigate('Login');
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  return (
    <StyledView className="flex-1 bg-white p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <StyledText className="text-xl font-bold mb-6">Register</StyledText>

        {category === '' && (
          <StyledView className="space-y-4 mb-6">
            <StyledTouchableOpacity
              onPress={() => handleCategorySelection('job_seeker')}
              className="flex-col items-center p-4 bg-white border border-gray-300 rounded-lg shadow-md"
            >
              <StyledText className="text-black-500 mt-2">
                <Icon name="user" size={40} color="black" /> {/* Job Seeker Icon */}
              </StyledText>
              <StyledText className="text-black-500 mt-2">Job Seeker</StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              onPress={() => handleCategorySelection('company')}
              className="flex-col items-center p-4 bg-white border border-gray-300 rounded-lg shadow-md"
            >
              <StyledText className="text-black-500 mt-2">
                <Icon name="building" size={40} color="black" /> {/* Company Icon */}
              </StyledText>
              <StyledText className="text-black-500 mt-2">Company</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        )}

        {category === 'job_seeker' && (
          <StyledView className="w-full">
            {/* Job Seeker Fields */}
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-4"
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-4"
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-4"
              placeholder="Username"
              value={formData.userName}
              onChangeText={(value) => handleChange('userName', value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-4"
              placeholder="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-4"
              placeholder="Skills"
              value={formData.skills}
              onChangeText={(value) => handleChange('skills', value)}
            />

            {/* Image Upload for Job Seeker */}
            <StyledTouchableOpacity onPress={pickImage} className="bg-blue-500 p-3 rounded mb-4">
              <StyledText className="text-white text-center">Pick Profile Image</StyledText>
            </StyledTouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginBottom: 10 }} />}

            <StyledTouchableOpacity onPress={handleSubmit} className="bg-blue-500 p-3 rounded">
              <StyledText className="text-white text-center">Register</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        )}

        {category === 'company' && (
          <StyledView className="w-full">
            {/* Company Fields */}
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-4"
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-4"
              placeholder="Username"
              value={formData.userName}
              onChangeText={(value) => handleChange('userName', value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-4"
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-4"
              placeholder="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
            />
            <StyledTextInput
              className="border border-gray-300 p-3 rounded mb-4"
              placeholder="Company Name"
              value={formData.companyName}
              onChangeText={(value) => handleChange('companyName', value)}
            />

            {/* Image Upload for Company */}
            <StyledTouchableOpacity onPress={pickImage} className="bg-blue-500 p-3 rounded mb-4">
              <StyledText className="text-white text-center">Pick Company Logo</StyledText>
            </StyledTouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginBottom: 10 }} />}

            <StyledTouchableOpacity onPress={handleSubmit} className="bg-blue-500 p-3 rounded">
              <StyledText className="text-white text-center">Register</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        )}

        {error && (
          <StyledText className="text-red-500 text-center mt-4">{error}</StyledText>
        )}
      </ScrollView>
    </StyledView>
  );
};

export default Register;
