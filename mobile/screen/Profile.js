import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showSavedJobs, setShowSavedJobs] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          Alert.alert("Error", "No token found, please log in again.");
          return;
        }

        const userEmail = await AsyncStorage.getItem("userEmail");

        if (!userEmail) {
          Alert.alert("Error", "No email found, please log in again.");
          return;
        }

        const response = await axios.get(`/user/users?email=${userEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Format the CV URL if it exists
        const formattedUser = {
          ...response.data,
          cv: response.data.cv
            ? `http://192.168.1.122:3001/${response.data.cv.replace("\\", "/")}`
            : null,
        };

        setUser(formattedUser);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Alert.alert("Error", "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Error", "No token found, please log in again.");
        return;
      }

      const response = await axios.get("/user/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSavedJobs(response.data);
      setShowSavedJobs(true);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      Alert.alert("Error", "Failed to fetch saved jobs.");
    }
  };

  // Handle CV download or view
  const handleDownloadCV = async () => {
    if (user.cv) {
      Linking.openURL(user.cv).catch((err) => {
        Alert.alert("Error", "Failed to open CV link.");
      });
    } else {
      Alert.alert("No CV", "This user does not have a CV available.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return <Text>No user profile found</Text>;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={{ uri: `http://192.168.1.122:3001/${user.image}` }}
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
        />
        <Text>Name: {user.name}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Username: {user.userName}</Text>
        <Text>Role: {user.role}</Text>
        <Text>Category: {user.category}</Text>
        <Text>Location: {user.location || "Not available"}</Text>
        <Text>Joined On: {new Date(user.createdAt).toDateString()}</Text>

        {/* Button to fetch saved jobs */}
        <TouchableOpacity
          onPress={fetchSavedJobs}
          style={{
            marginTop: 15,
            backgroundColor: "#007bff",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Show Saved Jobs</Text>
        </TouchableOpacity>

        {/* Button to view/download CV */}
        {user.category === "job_seeker" && (
          <TouchableOpacity
            onPress={handleDownloadCV}
            style={{
              marginTop: 15,
              backgroundColor: "#28a745",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>View CV</Text>
          </TouchableOpacity>
        )}

        {/* Show saved jobs if button is clicked */}
        {showSavedJobs && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Saved Jobs:</Text>
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <View
                  key={job._id}
                  style={{
                    marginVertical: 10,
                    padding: 10,
                    backgroundColor: "#f8f9fa",
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>{job.title}</Text>
                  <Text>{job.company} - {job.location}</Text>
                  <Text>Salary: ${job.salary}</Text>
                  <Text>Type: {job.employmentType}</Text>
                </View>
              ))
            ) : (
              <Text>No saved jobs found</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;
