import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
import axios from 'axios'; // For making API requests

const JobCreationForm = () => {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [skills, setSkills] = useState("");

  const handleSubmit = async () => {
    try {
      const jobData = {
        title,
        description,
        company,
        location,
        salary: parseFloat(salary), // Convert salary to a number
        employmentType,
        skills: skills.split(','),  // Convert skills string to an array
      };
      
      // Replace with your backend API URL
      await axios.post("http://192.168.1.69:3001/user/job", jobData);
      
      Alert.alert("Success", "Job created successfully!");

      // Reset form fields after submission
      setTitle("");
      setDescription("");
      setCompany("");
      setLocation("");
      setSalary("");
      setEmploymentType("");
      setSkills("");
      
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create job");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
        Create Job
      </Text>

      {/* Title */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>Job Title</Text>
        <TextInput
          style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 5 }}
          placeholder="Enter job title"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Description */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>Job Description</Text>
        <TextInput
          style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 5, height: 100 }}
          placeholder="Enter job description"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Company */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>Company</Text>
        <TextInput
          style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 5 }}
          placeholder="Enter company name"
          value={company}
          onChangeText={setCompany}
        />
      </View>

      {/* Location */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>Location</Text>
        <TextInput
          style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 5 }}
          placeholder="Enter job location"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {/* Salary */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>Salary</Text>
        <TextInput
          style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 5 }}
          placeholder="Enter salary"
          keyboardType="numeric"
          value={salary}
          onChangeText={setSalary}
        />
      </View>

      {/* Employment Type */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>Employment Type</Text>
        <TextInput
          style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 5 }}
          placeholder="e.g. Full-time, Part-time, Contract"
          value={employmentType}
          onChangeText={setEmploymentType}
        />
      </View>

      {/* Skills */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>Skills (comma separated)</Text>
        <TextInput
          style={{ borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 5 }}
          placeholder="Enter required skills"
          value={skills}
          onChangeText={setSkills}
        />
      </View>

      {/* Submit Button */}
      <Button title="Create Job" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default JobCreationForm;
