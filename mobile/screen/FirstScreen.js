import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

export default function FirstScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      {/* Top section with curved background */}
      <View className="w-full h-1/3 bg-gray-900 rounded-b-full absolute top-0" />

      {/* Logo section */}
      <View className="bg-white w-20 h-20 rounded-full justify-center items-center mt-16 shadow-lg">
        <Image
          source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/handshake.png' }} // Replace with your icon
          className="w-10 h-10"
        />
      </View>

      {/* Text section */}
      <View className="mt-8 items-center">
        <Text className="text-black text-2xl font-bold">JobConnect</Text>
        <Text className="text-gray-500 text-base mt-2">
          Connecting talent with opportunity.
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity className="bg-gray-900 rounded-full px-8 py-3 mt-8">
        <Text className="text-white text-base font-semibold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
