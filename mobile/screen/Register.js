import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { styled } from 'nativewind';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Eye, EyeOff } from 'lucide-react-native';

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
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const { email, userName, password, confirmPassword } = formData;

    if (!email || !userName || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: 'All fields are required.' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: 'Passwords do not match.' });
      return;
    }
    try {
      const response = await axios.post('/user/register', { email, userName, password });
      if (response.status === 201) {
        Toast.show({ type: 'success', text1: 'Registration Successful', text2: 'Your account has been created!' });
        navigation.navigate('CompleteProfile', { userId: response.data.user.userId });
      } else {
        Toast.show({ type: 'error', text1: 'Registration Failed', text2: response.data.error || 'An error occurred.' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Registration Error', text2: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <StyledView className="flex-1 bg-gray-100 p-6 items-center justify-center">
      {/* Logo */}
      <Image source={require('./assets/handshake.png')} className="w-96 h-72 mb-4" resizeMode="contain" />
      
      <StyledView className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        <StyledText className="text-2xl font-bold text-center mb-6">Welcome </StyledText>

        {/* Email */}
        <StyledTextInput className="border border-gray-300 p-3 rounded-lg mb-4" placeholder="Email" value={formData.email} onChangeText={(value) => handleChange('email', value)} />
        
        {/* Username */}
        <StyledTextInput className="border border-gray-300 p-3 rounded-lg mb-4" placeholder="Username" value={formData.userName} onChangeText={(value) => handleChange('userName', value)} />
        
        {/* Password */}
        <View className="border border-gray-300 p-3 rounded-lg mb-4 flex-row items-center">
          <StyledTextInput className="flex-1" placeholder="Password" secureTextEntry={!showPassword} value={formData.password} onChangeText={(value) => handleChange('password', value)} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <StyledTextInput className="border border-gray-300 p-3 rounded-lg mb-4" placeholder="Confirm Password" secureTextEntry value={formData.confirmPassword} onChangeText={(value) => handleChange('confirmPassword', value)} />
        
        {/* Submit Button */}
        <StyledTouchableOpacity onPress={handleSubmit} className="bg-black p-3 rounded-lg mb-4">
          <StyledText className="text-white text-center text-lg font-semibold">Sign In</StyledText>
        </StyledTouchableOpacity>

        {/* Sign In Link */}
        <StyledText className="text-center text-gray-500">Don’t have an account? <Text className="text-black font-semibold">Sign in</Text></StyledText>
      </StyledView>
      <Toast />
    </StyledView>
  );
};

export default Register;
