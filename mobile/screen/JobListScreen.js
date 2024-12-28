import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Button, TouchableOpacity, TextInput, Modal, SafeAreaView } from 'react-native';
import axios from 'axios';

const JobListScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({ resume: '', coverLetter: '' });

  // Fetch jobs from the API
  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://192.168.1.103:3001/user/jobs");
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch jobs");
      setLoading(false);
    }
  };

  // Handle the "Apply" button press
  const handleApply = (jobId) => {
    setSelectedJob(jobId);
    setIsApplying(true);
  };
  const renderJobItem = ({ item }) => (
    <View style={{ 
        padding: 15, 
        marginVertical: 10, 
        borderRadius: 10, 
        backgroundColor: '#fff', 
        elevation: 3,  // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>{item.company} - {item.location}</Text>
      <Text>Salary: ${item.salary}</Text>
      <Text>Type: {item.employmentType}</Text>
      <Text>Skills: {item.skills.join(', ')}</Text>
      
      {/* Apply Button */}
      <TouchableOpacity onPress={() => handleApply(item._id)} style={{ marginTop: 10, backgroundColor: '#007BFF', padding: 10, borderRadius: 5 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Apply</Text>
      </TouchableOpacity>
    </View>
  );

  // Handle form submission
  const handleSubmitApplication = async () => {
    try {
      const response = await axios.post(`http://192.168.1.103:3001/user/jobs/${selectedJob}/apply`, applicationData);
      Alert.alert("Success", "You have applied to the job successfully!");
      setIsApplying(false);
      setSelectedJob(null);
      setApplicationData({ resume: '', coverLetter: '' }); // Reset form
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to apply for the job");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  

  return (
    <SafeAreaView style={{ flex: 1, padding: 20  }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderJobItem}
          ListEmptyComponent={<Text>No jobs available</Text>}
        />
      )}

      {/* Application Form Modal */}
      <Modal
        transparent={true}
        visible={isApplying}
        animationType="slide"
      >
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Apply for Job</Text>

            <TextInput
              placeholder="Resume Link"
              value={applicationData.resume}
              onChangeText={(text) => setApplicationData({ ...applicationData, resume: text })}
              style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10 }}
            />
            <TextInput
              placeholder="Cover Letter"
              value={applicationData.coverLetter}
              onChangeText={(text) => setApplicationData({ ...applicationData, coverLetter: text })}
              style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10 }}
              multiline
              numberOfLines={4}
            />

            <Button title="Submit Application" onPress={handleSubmitApplication} />
            <Button title="Cancel" onPress={() => { setIsApplying(false); setSelectedJob(null); }} color="red" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default JobListScreen;
