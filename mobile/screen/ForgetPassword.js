import React, { useState } from "react";
import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faLock, faFacebookF, faGoogle } from "@fortawesome/free-solid-svg-icons";
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);
S

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const resetPassword = async (e) => {
  e.preventDefault();
  try {
    // Make the login request
    const response = await axios.post("http://192.168.1.69:3001/user/reset", { email, password });

    // Clear the email and password after successful login
    setEmail("");
    setPassword("");

    // Show success message
    alert("Login successful");
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Login failed:', error);

    // Handle error response and display a meaningful message
    if (error.response) {
      // Server responded with a status other than 2xx
      const { status, data } = error.response;
      console.error(`Error ${status}: ${data.message}`);
      alert(`Login failed: ${data.message || 'Unknown error occurred'}`);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('No response received:', error.request);
      alert('Login failed: No response from server');
    } else {
      // Something else happened while setting up the request
      console.error('Error setting up the request:', error.message);
      alert(`Login failed: ${error.message}`);
    }
  }
};


  return (
    <StyledView className="flex-1 justify-center items-center bg-white">
      <StyledView className="w-4/5">
        <StyledText className="text-2xl font-bold mb-4">Sign in</StyledText>
        
        <StyledView className="mb-4 flex-row items-center border-b border-gray-300">
          {/* <FontAwesomeIcon className="text-gray-500 mr-2" /> */}
          <StyledTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="flex-1 py-2"
          />
        </StyledView>
        
        <StyledView className="mb-4 flex-row items-center border-b border-gray-300">
          {/* <FontAwesomeIcon icon={faLock} className="text-gray-500 mr-2" /> */}
          <StyledTextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="flex-1 py-2"
          />
        </StyledView>

        <StyledPressable className="bg-blue-500 py-2 rounded" onPress={resetPassword}>
          <StyledText className="text-center text-white font-bold">Login</StyledText>
        </StyledPressable>

        <StyledText className="text-center text-gray-500 mt-4">Or Sign in with social platforms</StyledText>
        
        {/* <StyledView className="flex-row justify-center mt-4">
          <StyledPressable className="bg-blue-600 p-3 rounded-full mx-2">
            <FontAwesomeIcon icon={faFacebookF} className="text-white" />
          </StyledPressable>
          <StyledPressable className="bg-red-600 p-3 rounded-full mx-2">
            <FontAwesomeIcon icon={faGoogle} className="text-white" />
          </StyledPressable>
        </StyledView> */}
      </StyledView>
    </StyledView>
  );
};

export default ForgetPassword;
