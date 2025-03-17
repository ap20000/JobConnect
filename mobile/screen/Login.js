import React, { useState } from "react";
import axios from "axios";
import { 
  View, 
  Text, 
  TextInput, 
  ActivityIndicator, 
  SafeAreaView, 
  TouchableOpacity 
} from "react-native";
import { styled } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const loginUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/user/login", { email, password, platform: "mobile" });

      const { token, category } = response.data;
      

      if (!email || !token || !category) {
        throw new Error("Invalid login response. Missing required data.");
      }

      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userCategory", category);
    

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
      });

      setEmail("");
      setPassword("");

      if (category === "job_seeker") {
        navigation.navigate("HomeTabs", { email });
      } else {
        throw new Error("Unknown user category.");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.response?.data?.message || error.message,
      });
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
            Welcome back, you've been missed!
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
              <TouchableOpacity key={platform} className="p-3 bg-gray rounded-md">
                <Ionicons name={`logo-${platform}`} color="#6b7280" size={24} />
              </TouchableOpacity>
            ))}
          </StyledView>
        </StyledView>
      </StyledView>

      {/* Toast Message Component */}
      <Toast />
    </SafeAreaView>
  );
};

export default Login;
