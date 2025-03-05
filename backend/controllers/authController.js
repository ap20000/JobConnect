import mongoose from 'mongoose'; 

import UserAuth from "./models/userModel.js";
import Job from "./models/jobModel.js";
// import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import JobSeekerProfile from './models/jobSeekerProfile.js'; // Assuming you have a JobSeekerProfile model file
 // Adjust the import path as necessary

// Adjust the import path as necessary




















export const getUser = async (req, res) => {
   try {
    const { email } = req.query;  // Get email from query

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserAuth.findOne({ email }).select("-password");  // Find user by email

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDetails = {
      id: user._id,
      name: user.name,
      email: user.email,
      userName: user.userName,
      role: user.role,
      category: user.category,
      image: user.image || "default-profile.png",
      location: user.location || "Not available",
      createdAt: user.createdAt,
      isVerified: user.isVerified,
    };

    if (user.category === "job_seeker") {
      userDetails.education = user.education;
      userDetails.skills = user.skills;
      userDetails.experience = user.experience;
    } else if (user.category === "company") {
      userDetails.companyName = user.companyName;
    }

    res.status(200).json(userDetails);  // Send back the user details
  } catch (error) {
    console.error("Error fetching user details:", error);
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


// import UserAuth from "../models/UserAuth";  // Make sure this is the correct path

export const getHRCount = async (req, res) => {
  try {
    // Count users with the role of 'hr'
    const hrCount = await UserAuth.countDocuments({ companyRole: "hr" });
    console.log("HR Count from DB:", hrCount); // Log the count for HR
    res.status(200).json({ count: hrCount });
  } catch (error) {
    console.error("Error fetching HR count:", error.message);
    res.status(500).json({ error: "Server error fetching HR count" });
  }
};

// Get Company count
export const getCompanyCount = async (req, res) => {
  try {
    // Count users with the category of 'company'
    const companyCount = await UserAuth.countDocuments({ category: "company" });
    console.log("Company Count from DB:", companyCount); // Log the count for Company
    res.status(200).json({ count: companyCount });
  } catch (error) {
    console.error("Error fetching company count:", error.message);
    res.status(500).json({ error: "Server error fetching company count" });
  }
};

// Get Manager count
export const getManagerCount = async (req, res) => {
  try {
    // Count users with the companyRole of 'manager'
    const managerCount = await UserAuth.countDocuments({ companyRole: "manager" });
    console.log("Manager Count from DB:", managerCount); // Log the count for Manager
    res.status(200).json({ count: managerCount });
  } catch (error) {
    console.error("Error fetching manager count:", error.message);
    res.status(500).json({ error: "Server error fetching manager count" });
  }
};
// Get all jobs
// export const getAllJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find(); // Assuming your jobs are in the Job model
//     console.log("Jobs Data:", jobs); // Log job data for debugging
//     res.status(200).json(jobs);
//   } catch (error) {
//     console.error("Error fetching jobs:", error.message);
//     res.status(500).json({ error: "Server error fetching jobs" });
//   }
// };
export const getAllJobsWithCompanyAndHR = async (req, res) => {
  try {
    // Fetch all jobs and populate associated company and postedBy fields (with HR role)
    const jobs = await Job.find()
      .populate({
        path: "company",  // Populate company field
        select: "name category",  // Only retrieve the company name and category
        match: { category: "company" },  // Ensure it's a company type
      })
      .populate({
        path: "postedBy",   // Populate the postedBy field (HR or employer)
        select: "name  companyRole",  // Retrieve the HR's name, role, and companyRole
        match: { companyRole: "hr" },  // Only return users with role 'hr'
      });

    // Log the jobs to check if the population worked
    console.log(jobs);

    res.status(200).json(jobs); // Send the response with populated jobs
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res.status(500).json({ error: "Server error" }); // Handle server errors
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







