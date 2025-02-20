import bcrypt from 'bcryptjs';
import UserAuth from "./models/userModel.js";
import jwt from "jsonwebtoken";
import Application from "./models/Application.js";

export const registerUser = async (req, res) => {
  const { 
    name,
    userName, 
    email, 
    password, 
    confirmPassword,
    location,
    education, 
    skills, 
    experience
  } = req.body;

  try {
    // Check required fields
    if (!email || !password || !userName) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    // Check if the user already exists
    const existingUser = await UserAuth.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const image = req.file ? `/${req.file.filename}` : null;

    // Create user object for job seekers only
    const userFields = {
      name,
      userName,
      email,
      password: hashedPassword,
      confirmPassword,
      isProfileComplete: false, 
      category: "job_seeker", // Only job seekers can register
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
      message: "Job seeker registered successfully", 
      user: { userId: newUser._id, isProfileComplete: newUser.isProfileComplete } 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password, platform  } = req.body;

    const user = await UserAuth.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Enforce platform restrictions
    if (user.role === "admin" && platform === "mobile") {
      return res.status(403).json({ message: "User not found" });
    }
    if (user.role !== "user" && platform === "web") {
      return res.status(403).json({ message: "User not found" });
    }
    // const userCategory = user.category;
    // const companyRole = user.companyRole || null;
    // Store user details in session
    req.session.userId = user._id; // Store user ID in session
    req.session.role = user.role; // Store user role in session
    req.session.companyRole = user.companyRole || null;

    const token = jwt.sign({ userId: user._id, role: user.role,companyRole: user.companyRole }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    

    res.status(200).json({
      message: "Login Successful",
      token,
      role: user.role, // Include the user's role in the response
      category: user.category,
      companyRole: user.companyRole 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Failed to login user", error: error.message });
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


export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params; // Job ID from request params
    const userId = req.user.id; // Assuming the user is authenticated and stored in `req.user`
    const { resume, coverLetter } = req.body;

    // Validate required fields
    if (!resume || !coverLetter) {
      return res.status(400).json({ message: "Resume and cover letter are required." });
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Check if the user already applied
    const alreadyApplied = job.applicants.some((applicant) => applicant.userId.toString() === userId);
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    // Get user details
    const user = await User.findById(userId).select("name location education email experience");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Add applicant details to the job
    job.applicants.push({
      userId,
      resume,
      coverLetter,
      appliedAt: new Date(),
    });

    await job.save();

    res.status(200).json({
      message: "Job application submitted successfully!",
      applicant: {
        name: user.name,
        location: user.location,
        education: user.education,
        email: user.email,
        experience: user.experience,
        resume,
        coverLetter,
      },
    });
  } catch (error) {
    console.error("Error applying for job:", error);
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