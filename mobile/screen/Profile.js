import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          Alert.alert("Error", "No token found, please log in again.");
          return;
        }

        const userEmail = await AsyncStorage.getItem("userEmail"); // Get email from storage

        if (!userEmail) {
          Alert.alert("Error", "No email found, please log in again.");
          return;
        }

        // Fetch user profile
        const response = await axios.get(`/user/users?email=${userEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Alert.alert("Error", "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return <Text>No user profile found</Text>;
  }

  return (
    <View style={{ padding: 20, alignItems: "center" }}>
      {/* Display User Image */}
      <Image
        source={{ uri: `http://192.168.1.122:3001/${user.image}` }} // Adjust this URL as needed
        style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
      />

      {/* Display User Details */}
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Username: {user.userName}</Text>
      <Text>Role: {user.role}</Text>
      <Text>Category: {user.category}</Text>
      <Text>Location: {user.location || "Not available"}</Text>
      <Text>Joined On: {new Date(user.createdAt).toDateString()}</Text>

      {/* {user.category === "job_seeker" && (
        <>
          <Text>Education: {user.education || "Not provided"}</Text>
          <Text>Skills: {user.skills?.length > 0 ? user.skills.join(", ") : "Not provided"}</Text>
          <Text>Experience: {user.experience || "Not provided"}</Text>
        </>
      )} */}

      {user.category === "company" && <Text>Company: {user.companyName || "Not provided"}</Text>}
    </View>
  );
};

export default Profile;
