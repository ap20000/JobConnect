import Job from "./models/jobModel.js";


import bcrypt from "bcryptjs";
import User from "./models/userModel.js";

// Register a Company
export const registerCompany = async (req, res) => {
  try {
    const { companyName, userName, email, password, companyRole, location } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new company user
    const newCompany = new User({
      name: companyName, // Using companyName as name
      userName,
      email,
      password: hashedPassword,
      category: "company",
      companyRole: companyRole || "manager", // Defaults to "job_creator"
      companyName,
      location,
      isVerified: true, // Auto-verify companies (optional)
    });

    // Save company to the database
    await newCompany.save();

    res.status(201).json({
      message: "Company registered successfully!",
      company: {
        id: newCompany._id,
        companyName: newCompany.companyName,
        userName: newCompany.userName,
        email: newCompany.email,
        location: newCompany.location,
        companyRole: newCompany.companyRole,
      },
    });

  } catch (error) {
    console.error("Error registering company:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const registerHR = async (req, res) => {
  try {
    const { managerId, userName, email, password, location } = req.body;

    // Verify if the manager exists and belongs to a company
    const manager = await User.findOne({ _id: managerId, category: "company", companyRole: "manager" });

    if (!manager) {
      return res.status(403).json({ message: "Only managers can register HR users." });
    }

    // Check if HR email or username already exists
    const existingHR = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingHR) {
      return res.status(400).json({ message: "Email or username already exists." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new HR user
    const newHR = new User({
      name: userName,
      userName,
      email,
      password: hashedPassword,
      category: "company",
      companyRole: "hr", // HR role
      companyName: manager.companyName, // Assign HR to the same company as the manager
      location,
      isVerified: true, // Auto-verify HR (optional)
    });

    // Save HR user to the database
    await newHR.save();

    res.status(201).json({
      message: "HR registered successfully!",
      hr: {
        id: newHR._id,
        userName: newHR.userName,
        email: newHR.email,
        location: newHR.location,
        companyRole: newHR.companyRole,
        companyName: newHR.companyName,
      },
    });

  } catch (error) {
    console.error("Error registering HR:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


// Create a Job (Only for Employers)
export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, employmentType, skills } = req.body;
    const employerId = req.user.id; // Assuming you store employer ID in `req.user`

    // Validate required fields
    if (!title || !description || !company || !location || !salary || !employmentType || !skills) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create new job
    const newJob = new Job({
      title,
      description,
      company,
      location,
      salary,
      employmentType,
      skills,
      postedBy: employerId, // Store employer ID
    });

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
