import mongoose from 'mongoose'; 
import bcrypt from 'bcryptjs';
import UserAuth from "./models/userModel.js";
import User from "./models/userModel.js";
import jwt from "jsonwebtoken";
import JobSeekerProfile from './models/jobSeekerProfile.js'; // Assuming you have a JobSeekerProfile model file
import Job from './models/jobCreating.js'; // Adjust the import path as necessary

// Adjust the import path as necessary




















export const getUser = async (req, res) => {
  try {
    // Extract email from the request parameters or body
    const { email } = req.params;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Fetch user details from the database using the email
    const user = await UserAuth.findOne({ email }, "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Base URL for images
    

    // Construct response object
    const userDetails = {
      id: user._id,
      name:user.name,
      email: user.email,
      
      userName: user.userName,
      role: user.role,
      category: user.category,
      image: `${user.image}`,
      location:user.location,
      createdAt: user.createdAt,
      isVerified: user.isVerified
    };

    // Additional fields for job seekers
    if (user.category === 'job_seeker') {
      userDetails.education = user.education;
      userDetails.skills = user.skills;
      userDetails.experience = user.experience;
    }

    // Additional fields for companies
    if (user.category === 'company') {
      userDetails.companyName = user.companyName;
    }

    // Send response with user details
    res.status(200).json(userDetails);
    
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: "Error fetching user details", error: error.message });
  }
};




export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding their passwords
    const users = await UserAuth.find({}, '-password');
    
    // Log the number of users fetched
    console.log(`Fetched ${users.length} users`);

    // Respond with the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error); // Log the error with stack trace
    res.status(500).json({ message: "Failed to retrieve users", error: error.message });
  }
};
export const getUserCount = async (req, res) => {
    try {
        const userCount = await UserAuth.countDocuments(); // Corrected to use UserAuth
        res.status(200).json({ count: userCount });
    } catch (error) {
        console.error("Error fetching user count:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};


export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  console.log(`Attempting to delete user with ID: ${userId}`);

  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log(`Invalid ID format: ${userId}`);
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const result = await UserAuth.findByIdAndDelete(userId);

    if (result) {
      console.log(`User with ID: ${userId} deleted successfully`);
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      console.log(`User with ID: ${userId} not found`);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// // Controller function to handle job seeker profile creation
export const jobSeeker = async (req, res) => {
  try {
    // Verify the token from the authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the decoded user info to req.user

    // Extract data from the request body
    const {
      name,
      location,
      collegeName,
      year,
      subject,
      skills,
      experience,
      resume,
    } = req.body;

    // Check if required fields are provided
    if (!name || !collegeName || !subject) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "/uploads/default-user.png";

    // Create a new job seeker profile
    const newJobSeekerProfile = new JobSeekerProfile({

      name,
      location,
      collegeName,
      year,
      subject,
      skills,
      experience,
      resume,
      image,
    });

    // Save the profile to the database
    await newJobSeekerProfile.save();

    // Respond with success message and profile data
    res.status(201).json({
      message: "Profile created successfully",
      profile: newJobSeekerProfile,
    });
  } catch (error) {
    console.error("Error creating job seeker profile:", error);
    res.status(500).json({
      message: "An error occurred while creating the profile",
      error: error.message,
    });
  }
};





export const createJob = async (req, res) => {
  try {
    // Ensure the user is authenticated
    const user = req.user; // Assumes authentication middleware sets `req.user`
    
    if (!user) {
      return res.status(401).json({ nmessage: "Unauthorized. Please log in." });
    }

    // Check if the user is a company
    if (user.category !== "company") {
      return res.status(403).json({ message: "Only companies can create job postings." });
    }

    // Extract job details from the request body
    const {
      title,
      description,
      company,
      location,
      salary,
      employmentType,
      skills,
    } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !company || !location || !salary || !employmentType || !skills) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Create a new job object
    const newJob = new Job({
      title,
      description,
      company,
      location,
      salary,
      employmentType,
      skills,
      postedBy: user._id, // Associate the job with the company's user ID
    });

    // Save the job to the database
    await newJob.save();

    // Respond with success message and job data
    res.status(201).json({
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      message: "An error occurred while creating the job",
      error: error.message,
    });
  }
};


export const getAllJobs = async (req, res) => {
  try {
    // Fetch all jobs from the database
    const jobs = await Job.find();

    // Return the jobs in the response
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      message: "An error occurred while fetching the jobs",
      error: error.message,
    });
  }
};