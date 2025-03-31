import React, { useState } from "react";
import axios from "axios";
import { View, Text, TextInput, Pressable, Alert, Image } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = async () => {
    try {
      const response = await axios.post("http://192.168.1.69:3001/user/reset", {
        email, 
        oldpassword: oldPassword, 
        newPassword: newPassword
      });
      setEmail("");
      setOldPassword("");
      setNewPassword("");
      Alert.alert("Password Reset Successful", "Your password has been reset successfully.");
    } catch (error) {
      console.error('Password reset failed:', error);
      Alert.alert("Error", error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <StyledView className="flex-1 justify-center items-center bg-gray-100 p-6">
      <StyledView className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-sm">
        <StyledView className="items-center mb-4">
          <Image source={require('./handshake-icon.png')} className="w-20 h-20 rounded-full bg-gray-300" />
        </StyledView>
        
        <StyledText className="text-center text-xl font-bold mb-4">Forget Password</StyledText>
        
        <StyledTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full"
        />
        
        <StyledTextInput
          placeholder="Old Password"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full"
        />
        
        <StyledTextInput
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full"
        />

        <StyledPressable className="bg-black py-2 rounded-lg w-full" onPress={resetPassword}>
          <StyledText className="text-center text-white font-bold">Submit</StyledText>
        </StyledPressable>

        <StyledText className="text-center my-4 text-gray-500">or</StyledText>

        <StyledText className="text-center text-gray-600">Don't have an account? <Text className="text-black font-bold">Sign in</Text></StyledText>
      </StyledView>
    </StyledView>
  );
};

export default ForgetPassword;