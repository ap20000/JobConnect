import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, ActivityIndicator, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Eye, Facebook, Instagram, Phone } from 'lucide-react-native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const loginUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/user/login', { email, password, platform: 'mobile' });
      console.log("Login Response:", response.data); 
      const { token, category   } = response.data;
      
      if (!email || !token || !category ) throw new Error('Invalid login response. Missing required data.');
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userCategory', category);
      
      setEmail('');
      setPassword('');
      Toast.show({ type: 'success', position: 'top', text1: 'Login Successful' });
      setTimeout(() => navigation.navigate('HomeTabs', { email }), 1000);
    } catch (error) {
      Toast.show({ type: 'error', position: 'top', text1: error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#232639]">
      <View className="p-6 bg-white rounded-t-3xl flex-1 justify-between">
        {/* Logo on top */}
        <View className="items-center my-1">
          <Image source={require('./assets/handshake.png')} className="w-96 h-72" />
        </View>

        <View >
          <View className="mt-12 items-center my-6">
            <Text className="text-xl font-bold mt-0">Welcome back</Text>
          </View>

          <View className="my-1 space-y-4">
            <TextInput className="border border-gray-300 p-4 rounded-md" placeholder="Email" value={email} onChangeText={setEmail} />
            <View className="border border-gray-300 p-4 rounded-md flex-row justify-between items-center">
              <TextInput className="flex-1" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
              <Eye size={20} color="gray" />
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#232639" className="my-6" />
          ) : (
            <TouchableOpacity className="bg-[#232639] py-4 my-6 rounded-md" onPress={loginUser}>
              <Text className="text-lg font-bold text-white text-center">Continue</Text>
            </TouchableOpacity>
          )}

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-600">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <View className="flex-row justify-center space-x-6 my-4">
            <TouchableOpacity className="p-3 border border-gray-400 rounded-md">
              <Facebook size={24} color="#232639" />
            </TouchableOpacity>
            <TouchableOpacity className="p-3 border border-gray-400 rounded-md">
              <Instagram size={24} color="#232639" />
            </TouchableOpacity>
            <TouchableOpacity className="p-3 border border-gray-400 rounded-md">
              <Phone size={24} color="#232639" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} className="mt-6">
            <Text className="text-center text-gray-700">
              Don’t have an account? <Text className="text-[#232639] font-bold">Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

export default Login;
