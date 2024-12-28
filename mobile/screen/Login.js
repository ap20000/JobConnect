import React, { useState } from "react";
import axios from "axios";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView, 
  TouchableOpacity 
} from "react-native";
import { styled } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const loginUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/user/login", { email, password });

      // Extract data safely
      const { token, category } = response.data;

      // Check for valid values
      if (!email || !token || !category) {
        throw new Error("Invalid login response. Missing required data.");
      }

      // Store valid values in AsyncStorage
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userCategory", category);

      Alert.alert("Login successful");

      // Clear the inputs
      setEmail("");
      setPassword("");

      // Navigate to screens based on category
      if (category === "job_seeker") {
        console.log("Navigating to HomeScreen");
        navigation.navigate("HomeScreen", { email });
      } else if (category === "company") {
        console.log("Navigating to CompanyHome");
        navigation.navigate("CompanyHome", { email });
      } else {
        throw new Error("Unknown user category.");
      }
    } catch (error) {
      // Handle errors and provide user feedback
      Alert.alert("Login failed", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StyledView className="p-6">
        <StyledView className="items-center">
          <StyledText className="text-3xl text-primary font-bold my-6">
            Login here
          </StyledText>
          <StyledText className="text-lg font-semibold text-center max-w-[60%]">
            Welcome back you've been missed!
          </StyledText>
        </StyledView>

        <StyledView className="my-6 space-y-4">
          <StyledTextInput
            className="border border-black-300 p-4 rounded-md"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <StyledTextInput
            className="border border-black-300 p-4 rounded-md"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </StyledView>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" className="my-6" />
        ) : (
          <TouchableOpacity
            className="bg-primary py-4 my-6 rounded-md shadow-lg"
            onPress={loginUser}
          >
            <Text className="text-lg font-bold text-onPrimary text-center">
              Sign in
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <StyledText className="text-sm font-semibold text-center text-text">
            Create new account
          </StyledText>
        </TouchableOpacity>

        <StyledView className="my-6">
          <StyledText className="text-sm font-semibold text-center text-primary">
            Or continue with
          </StyledText>
          <StyledView className="flex-row justify-center mt-4 space-x-4">
            {["google", "apple", "facebook"].map((platform) => (
              <TouchableOpacity
                key={platform}
                className="p-3 bg-gray rounded-md"
              >
                <Ionicons
                  name={`logo-${platform}`}
                  color="#6b7280"
                  size={24}
                />
              </TouchableOpacity>
            ))}
          </StyledView>
        </StyledView>
      </StyledView>
    </SafeAreaView>
  );
};

export default Login;
