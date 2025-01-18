import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';

import Login from './screen/Login';
import Profile from './screen/Profile';
import JobSeekerProfile from './screen/JobSeekerProfile';
import Register from './screen/Register';
import HomeScreen from './screen/HomeScreen';
import FirstScreen from './screen/FirstScreen';
import JobListScreen from './screen/JobListScreen';
import CompleteProfile from './screen/CompleteProfile ';

axios.defaults.baseURL = "http://192.168.1.75:3001";
axios.defaults.withCredentials = true;


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="JobSeekerProfile" component={JobSeekerProfile} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="FirstScreen" component={FirstScreen} />
            
              <Stack.Screen name="JobListScreen" component={JobListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
