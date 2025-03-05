import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";

// Import Screens
import Login from './screen/Login';
import Register from './screen/Register';
import CompleteProfile from './screen/CompleteProfile';
import JobSeekerProfile from './screen/JobSeekerProfile';
import FirstScreen from './screen/FirstScreen';
import ApplyJobScreen from './screen/ApplyJobScreen';
import JobDetailScreen from './screen/JobDetailScreen';
import HomeTabs from "./screen/HomeTabs"; // Import Bottom Tab Navigation

// Axios Config (Update your backend URL)
// axios.defaults.baseURL = "http://100.64.218.51:3002";
axios.defaults.withCredentials = true;

axios.defaults.baseURL = "http://192.168.1.122:3001";


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="JobSeekerProfile" component={JobSeekerProfile} />
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="ApplyJobScreen" component={ApplyJobScreen} />
        <Stack.Screen name="JobDetailScreen" component={JobDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
