import bcrypt from 'bcryptjs';
import UserAuth from "./models/userModel.js";
import User from "./models/userModel.js";
import jwt from "jsonwebtoken";
import Application from "./models/Application.js";
import Job from "./models/jobModel.js";

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

    if (user.role === "user" && platform === "web") {
      return res.status(403).json({ message: "Users cannot log in from the web." });
    }

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
  const image = req.file ? req.file.filename : null;

  try {
    const user = await UserAuth.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name || user.name;
    user.skills = skills || user.skills;
    user.education = education || user.education;
    user.experience = experience || user.experience;
    user.location = location || user.location;
    if (image) user.image = image;

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


// import Job from "../models/Job.js";
// import User from "../models/User.js";

// import Job from "../models/Job.js";
// import User from "../models/User.js";

export const applyForJob = async (req, res) => {
  try {
    console.log("Decoded user from token:", req.user); // Debugging line

    const { jobId } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const userId = req.user.id;

    // Check if jobId and CV are provided
    if (!req.file) return res.status(400).json({ message: "CV is required." });
    if (!jobId) return res.status(400).json({ message: "Job ID is required." });

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });

    // Check if user already applied
    if (job.applicants.some(app => app.userId.toString() === userId)) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    // Find the user
    const user = await User.findById(userId).select("name location education email experience");
    if (!user) return res.status(404).json({ message: "User not found in the database." });

    // Save CV and update job
    const cvUrl = `/uploadsCV/${req.file.filename}`;
    job.applicants.push({ userId, cv: cvUrl, appliedAt: new Date() });
    await job.save();

    res.status(200).json({ message: "Application submitted successfully!" });

  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Server error." });
  }
};


 // Import Job model

// Controller to fetch all jobs
export const AllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("company").populate("postedBy"); // Populate related data

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found." });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
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