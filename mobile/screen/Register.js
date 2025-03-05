import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const { email, userName, password, confirmPassword } = formData;

    if (!email || !userName || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, userName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Registration successful');
        
        // Navigate to the complete profile page with the user ID
        navigation.navigate('CompleteProfile', { userId: data.user.userId });
      } else {
        setError(data.error || 'An error occurred.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
  };

  return (
    <StyledView className="flex-1 bg-white p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <StyledText className="text-xl font-bold mb-6">Student Register</StyledText>

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
          placeholder="Confirm Password"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(value) => handleChange('confirmPassword', value)}
        />

        {error && <StyledText className="text-red-500 text-center mb-4">{error}</StyledText>}

        <StyledTouchableOpacity onPress={handleSubmit} className="bg-blue-500 p-3 rounded">
          <StyledText className="text-white text-center">Register</StyledText>
        </StyledTouchableOpacity>
      </ScrollView>
    </StyledView>
  );
};

export default Register;
