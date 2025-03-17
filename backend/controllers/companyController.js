import Job from "./models/jobModel.js";
import jwt from 'jsonwebtoken';
import Application from "./models/Application.js"; // Fetching from user folder
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";

// Register a Company
export const registerCompany = async (req, res) => {
  try {
    const { name, userName, email, password, companyName, location } = req.body;
     const image = req.files && req.files.image ? req.files.image[0].filename : null;

    // Check if a manager already exists for this company (optional step to avoid duplicates)
    const existingManager = await User.findOne({ email, companyRole: "manager" });
    if (existingManager) {
      return res.status(400).json({ message: "A manager already exists for this company." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newManager = new User({
      name,
      userName,
      email,
      password: hashedPassword,
      companyName,
      companyRole: "manager",
      location,
      image,
      category: "company",  // Indicating this is a company account
      isVerified: true,
    });

    const savedManager = await newManager.save();
    res.status(201).json({ message: "Manager registered successfully!", managerId: savedManager._id });
  } catch (error) {
    res.status(500).json({ message: "Server error. Try again later." });
  }
};



export const registerHR = async (req, res) => {
  try {
    const { userName, email, password, location } = req.body;

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided, please log in." });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging log

    if (!decoded || decoded.companyRole !== "manager") {
      return res.status(403).json({ message: "Unauthorized. Only managers can register HR." });
    }

    // Use `userId` instead of `email` to find the manager
    const managerId = decoded.userId;
    const manager = await User.findOne({ _id: managerId, companyRole: "manager" });

    if (!manager) {
      return res.status(404).json({ message: "Manager not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newHR = new User({
      userName,
      email,
      password: hashedPassword,
      category: "company",
      companyRole: "hr",
      companyName: manager.companyName,
      location,
      isVerified: true,
    });

    await newHR.save();
    res.status(201).json({ message: "HR registered successfully!" });

  } catch (error) {
    console.error("Error during HR registration:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};


// Create a Job (Only for Employers)
import mongoose from 'mongoose';
// import Job from '../models/Job'; // Assuming the path to the Job model

// import mongoose from 'mongoose';
// import Job from '../models/Job'; // Assuming the path to the Job model
// import User from '../models/User'; // Assuming the path to the User model

// import mongoose from 'mongoose';

export const createJob = async (req, res) => {
  try {
    console.log("User from token:", req.user); // Debugging
    
    const { title, position, description, location, salary, employmentType, skills } = req.body;
    const employerId = req.user.userId; // Employer's user ID from token

    // Ensure employerId exists
    if (!employerId) {
      return res.status(403).json({ message: "Unauthorized: Employer ID missing." });
    }

    // Fetch the employer's user document
    const employer = await User.findById(employerId);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found." });
    }

    // Ensure employer has a company name (assumed the employer is an HR or manager)
    const companyName = employer.companyName;
    if (!companyName) {
      return res.status(400).json({ message: "Employer is not associated with a company." });
    }

    // Check if all required fields are present
    if (!title || !description || !location || !salary || !employmentType || !skills) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Convert skills to an array if it's a comma-separated string
    let skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());

    // Create the job
    const newJob = new Job({
      title,
      position,
      description,
      location,
      salary,
      employmentType,
      skills: skillsArray,
      companyName,  // Add company name here
      postedBy: employerId, // Store employer ID directly
    });

    // Save the job to the database
    await newJob.save();

    res.status(201).json({ message: "Job created successfully!", job: newJob });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


// Get all jobs posted by a specific company
export const getCompanyJobs = async (req, res) => {
  try {
    const { companyId } = req.params; // Get company ID from request params

    const jobs = await Job.find({ postedBy: companyId }).populate("postedBy", "companyName email");

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found for this company." });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


export const getAllJobs = async (req, res) => {
  try {
    console.log("Decoded user from token:", req.user); // Debugging

    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: "Employer ID is required." });
    }

    const employerId = req.user.userId; // Use userId instead of _id
    const jobs = await Job.find({ postedBy: employerId });

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found." });
    }

    res.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get a specific job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a job
export const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true });
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.jobId);
    if (!deletedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get applicants for a job
// Controller for fetching job applicants
export const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    // Check if jobId is provided in the request parameters
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Find applicants for the given jobId
    const applicants = await Application.find({ jobId })
      .populate("userId", "name location education email experience cv");

     applicants.forEach((applicant) => {
      if (applicant.userId.cv && !applicant.userId.cv.startsWith("uploadsCV")) {
        applicant.userId.cv = `/${applicant.userId.cv}`;
      }
    });
    // If no applicants found for the job, return an appropriate message
    if (!applicants || applicants.length === 0) {
      return res.status(404).json({ message: "No applicants found for this job" });
    }

    // Return the list of applicants for the job
    res.status(200).json(applicants);
  } catch (error) {
    // Handle server errors
    console.error("Error fetching applicants:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// import Job from "../models/Job.js";
// import Application from "../models/Application.js";

export const getApplicantsForEmployer = async (req, res) => {
  try {
    const employerId = req.user.userId; // Employer's ID (company that posted jobs)

    // Find all jobs posted by this employer
    const jobs = await Job.find({ company: employerId }).select("_id");

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found for this employer" });
    }

    // Extract job IDs
    const jobIds = jobs.map(job => job._id);

    // Find applications for these jobs
    const applicants = await Application.find({ jobId: { $in: jobIds } })
      .populate("userId", "name location education email experience cv");

    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Shortlist an applicant


// Get shortlisted applicants for a specific job
export const getShortlistedApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find all applications for the job and filter by "shortlisted" status
    const applications = await Application.find({ jobId, isShortlisted: "Shortlisted" })
      .populate("userId", "name location cv");  // Populate the userId field (not applicant)

    if (!applications.length) {
      return res.status(404).json({ message: "No shortlisted applicants found." });
    }

    res.status(200).json({ applicants: applications });
  } catch (error) {
    console.error("Error fetching shortlisted applicants:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get notlisted (rejected) applicants for a specific job
export const getNotlistedApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find all applications for the job and filter by "notlisted" status
    const applications = await Application.find({ jobId, isShortlisted: "Not Shortlisted" })
      .populate("userId", "name location cv");  // Populate the userId field (not applicant)

    if (!applications.length) {
      return res.status(404).json({ message: "No notlisted applicants found." });
    }

    res.status(200).json({ applicants: applications });
  } catch (error) {
    console.error("Error fetching notlisted applicants:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const shortlistApplicant = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    // Find the application by ID and populate user details
    const application = await Application.findById(applicationId).populate("applicant", "name location cv");
    
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Update the status to "shortlisted"
    application.status = "shortlisted";
    await application.save();

    res.status(200).json({ 
      message: "Applicant shortlisted successfully!", 
      application: {
        id: application._id,
        status: application.status,
        name: application.applicant.name,
        location: application.applicant.location,
        cv: application.applicant.cv
      }
    });
  } catch (error) {
    console.error("Error shortlisting applicant:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Notlist (reject) an applicant
export const notlistApplicant = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    // Find the application by ID and populate user details
    const application = await Application.findById(applicationId).populate("applicant", "name location cv");
    
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Update the status to "notlisted"
    application.status = "notlisted";
    await application.save();

    res.status(200).json({ 
      message: "Applicant notlisted successfully!", 
      application: {
        id: application._id,
        status: application.status,
        name: application.applicant.name,
        location: application.applicant.location,
        cv: application.applicant.cv
      }
    });
  } catch (error) {
    console.error("Error notlisting applicant:", error);
    res.status(500).json({ message: "Server error." });
  }
};
