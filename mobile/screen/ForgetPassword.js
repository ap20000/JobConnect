import React, { useState } from "react";
import axios from "axios";
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      // Make the password reset request
      const response = await axios.post("http://192.168.1.69:3001/user/reset", {
        email, 
        oldpassword: oldPassword, 
        newPassword: newPassword
      });

      // Clear the fields after successful password reset
      setEmail("");
      setOldPassword("");
      setNewPassword("");

      // Show success message
      Alert.alert("Password Reset Successful", "Your password has been reset successfully.");
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Password reset failed:', error);

      // Handle error response and display a meaningful message
      if (error.response) {
        const { status, data } = error.response;
        console.error(`Error ${status}: ${data.message}`);
        Alert.alert("Error", data.message || "Unknown error occurred");
      } else if (error.request) {
        console.error('No response received:', error.request);
        Alert.alert("Error", "No response from server");
      } else {
        console.error('Error setting up the request:', error.message);
        Alert.alert("Error", error.message || "Password reset failed");
      }
    }
  };

  return (
    <StyledView className="flex-1 justify-center items-center bg-white">
      <StyledView className="w-4/5">
        <StyledText className="text-2xl font-bold mb-4">Reset Password</StyledText>
        
        <StyledView className="mb-4 flex-row items-center border-b border-gray-300">
          <StyledTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="flex-1 py-2"
          />
        </StyledView>
        
        <StyledView className="mb-4 flex-row items-center border-b border-gray-300">
          <StyledTextInput
            placeholder="Old Password"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
            className="flex-1 py-2"
          />
        </StyledView>

        <StyledView className="mb-4 flex-row items-center border-b border-gray-300">
          <StyledTextInput
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            className="flex-1 py-2"
          />
        </StyledView>

        <StyledPressable className="bg-blue-500 py-2 rounded" onPress={resetPassword}>
          <StyledText className="text-center text-white font-bold">Reset Password</StyledText>
        </StyledPressable>
      </StyledView>
    </StyledView>
  );
};

export default ForgetPassword;
