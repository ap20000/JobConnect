import bcrypt from 'bcryptjs';
import UserAuth from "./models/userModel.js";
import User from "./models/userModel.js";
import jwt from "jsonwebtoken";
import Application from "./models/Application.js";
import Job from "./models/jobModel.js";
import mongoose from "mongoose";


export const registerUser = async (req, res) => {
  const { 
    name,
    userName, 
    email, 
    password, 
    confirmPassword,
    role,  // Add role from request body
    location,
    education, 
    skills, 
    experience
  } = req.body;

  try {
    // Check required fields
    if (!email || !password || !userName ) {
      return res.status(400).json({ error: "Username, email, password, and role are required" });
    }

    // Check if the user already exists
    const existingUser = await UserAuth.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const image = req.file ? `/${req.file.filename}` : null;

    // Create user object with dynamic role
    const userFields = {
      name,
      userName,
      email,
      password: hashedPassword,
      confirmPassword,
      role, // Dynamically assign the role passed in the request
      category: "job_seeker",  // Default category for job seekers (could be dynamic as well)
      image,
      location,
      education,
      skills,
      experience
    };

    // Save the new user to the database
    const newUser = new UserAuth(userFields);
    await newUser.save();

    res.status(201).json({ 
      message: `${role} registered successfully`,  // Role-specific message
      user: { userId: newUser._id }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



// Ensure correct import

export const loginUser = async (req, res) => {
  try {
    const { email, password, platform } = req.body;

    if (!email || !password || !platform) {
      return res.status(400).json({ message: "Email, password, and platform are required." });
    }

    const user = await UserAuth.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Restrict login based on platform
    if ((user.role === "admin" || user.role === "company") && platform === "mobile") {
      return res.status(403).json({ message: "Admins and companies cannot log in from mobile." });
    }

    // if (user.role === "user" && platform === "web") {
    //   return res.status(403).json({ message: "Users cannot log in from the web." });
    // }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, companyRole: user.companyRole || null },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      role: user.role,
      category: user.category,
      companyRole: user.companyRole || null,
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Failed to login user", error: error.message });
  }
};


export const completeProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, skills, education, experience, location } = req.body;
  const image = req.files && req.files.image ? req.files.image[0].filename : null;
  const cv = req.files && req.files.cv ? req.files.cv[0].path : null;

  try {
    if (!cv) {
      return res.status(400).json({ error: "CV is required" });
    }

    const user = await UserAuth.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name || user.name;
    user.skills = skills || user.skills;
      user.education = education ? JSON.parse(education) : user.education; // Parse education array
    user.experience = experience ? JSON.parse(experience) : user.experience; 
    user.location = location || user.location;
    if (image) user.image = image;
    if (cv) user.cv = cv;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, oldpassword, newPassword } = req.body;
    const user = await UserAuth.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Username" });
    }

    const isMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password does not match" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successfull" });
  } catch (error) {
    res.status(400).json({ message: "Failed to reset password" });
  }
};

export const updateProfile = async (req, res) => {
  // Log the request parameters and body
  console.log('Request Parameters:', req.params);
  console.log('Request Body:', req.body);

  try {
    const userId = req.params.id; // Get user ID from request parameters
    const updateData = req.body;

    // Check if userId is valid
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the user by ID and update with new data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Success response
    res.status(200).json({
      message: 'User updated successfully',
      updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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
      cv: user.cv || null,
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

// import Job from "../models/Job.js";
// import User from "../models/User.js";

// import Job from "../models/Job.js";
// import User from "../models/User.js";

// import mongoose from "mongoose";
// import Job from "../models/Job.js";  // Adjust path as needed
// import User from "../models/User.js"; // Ensure correct import

// import mongoose from "mongoose";
// import Job from "../models/jobModel.js";  // Ensure the correct path to your Job model
// import Application from "../models/applicationModel.js"; // Ensure correct path to Application model
// import User from "../models/userModel.js"; // Ensure correct path to User model

// const User = require('../models/User');
// const Job = require('../models/Job');
// const Application = require('../models/Application');

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.userId; // Extract user ID from token

    console.log("Extracted userId from token:", userId);

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Use CV stored in the user's profile instead of asking for a new upload
    if (!user.cv) {
      return res.status(400).json({ message: "You must upload a CV in your profile before applying." });
    }

    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    const newApplication = new Application({
      userId: user._id,
      jobId,
      name: user.name,
      email: user.email,
      location: user.location || "Not Provided",
      education: user.education.length ? user.education[0].degree : "Not Provided",
      experience: user.experience.length ? user.experience[0].role : "Not Provided",
      cv: user.cv, // Use stored CV path
    });

    await newApplication.save();

    await Job.findByIdAndUpdate(jobId, {
      $push: { 
        applicants: { 
          userId: user._id, 
          appliedAt: new Date() 
        }
      }, 
    });

    res.status(201).json({ message: "Job application successful!", application: newApplication });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

export const checkApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.userId; // Extract user ID from token

    const application = await Application.findOne({ jobId, userId });

    res.json({ applied: !!application }); // Returns true if applied, false otherwise
  } catch (error) {
    console.error("Error checking application status:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};


// module.exports = { applyForJob };

 // Import Job model

// Controller to fetch all jobs
export const AllJobs = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {}; // Default: Fetch all jobs

    if (search && search.trim() !== "") {
      query.title = { $regex: `^${search}`, $options: "i" }; // Matches titles starting with search term
    }

    const jobs = await Job.find(query).populate("company").populate("postedBy");

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// const User = require("../models/User");
// const Job = require("../models/Job");

// Save Job to User's List
export const saveJob = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from token
    const { jobId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job already saved" });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({ message: "Job saved successfully", savedJobs: user.savedJobs });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch Saved Jobs
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("savedJobs");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.savedJobs);
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Get all jobs a user has applied for
export const getUserAppliedJobs = async (req, res) => {
  try {
    const userId = req.params.userId;
    const applications = await Application.find({ userId }).populate("jobId", "title company location salary");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Search jobs by company name and job title
export const searchJobs = async (req, res) => {
  try {
    const { search } = req.query; // Get the search query parameter

    // Build the search query
    let searchQuery = {};

    if (search && search.trim() !== "") {
      // If search query exists, search by job title only
      searchQuery['title'] = { $regex: search, $options: 'i' };
    }

    // Find jobs based on the search query
    const jobs = await Job.find(searchQuery)
      .populate('company')  // Populate company details (optional, can be removed if not needed)
      .populate('postedBy'); // Populate user (employer) who posted the job

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found matching the title." });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error searching for jobs:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
