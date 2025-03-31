import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import natural from 'natural';
import Application from './models/Application.js';
import Job from './models/jobModel.js';
import User from './models/userModel.js';
import { fileURLToPath } from 'url';
import { sendApplicationSuccessEmail } from "./emailController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract skills from CV
const extractSkillsFromCV = async (cvPath) => {
  try {
    if (!fs.existsSync(cvPath)) {
      console.error("CV file not found:", cvPath);
      return [];
    }

    const dataBuffer = fs.readFileSync(cvPath);
    const data = await pdfParse(dataBuffer);

    if (!data.text || data.text.trim().length === 0) {
      console.error("No valid text extracted from CV.");
      return [];
    }

    // Clean up text by removing unwanted characters (preserving spaces and commas)
    const cleanedText = data.text.replace(/[^a-zA-Z0-9\s,]/g, '').toLowerCase();
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(cleanedText);

    // Predefined list of technical skills to match (can be expanded)
    const predefinedSkills = [
        // IT Skills
        'mobile', 'application', 'development', 'ecommerce', 'solutions', 'frontend',
        'backend', 'database', 'management', 'iot', 'project', 'skills', 'android', 'java',
        'php', 'flutter', 'xml', 'vs', 'studio', 'html', 'css', 'javascript', 'react', 'node',
        'python', 'swift', 'c++', 'ruby', 'typescript', 'angular', 'vue', 'sql', 'nosql', 'git',
        'cloud', 'aws', 'azure', 'docker', 'kubernetes', 'devops', 'automation', 'linux', 'bash',
        'networking', 'ai', 'machine learning', 'deep learning', 'data analysis', 'data science', 'cybersecurity', 'penetration testing',
        'blockchain', 'flutter', 'firebase', 'graphql', 'api', 'json', 'web', 'app', 'ux', 'ui', 'gitlab',
        
        // Business/Marketing Skills
        'communication', 'teamwork', 'leadership', 'negotiation', 'problem-solving', 'critical thinking',
        'project management', 'customer service', 'time management', 'sales', 'digital marketing', 'content marketing',
        'brand management', 'seo', 'sem', 'social media marketing', 'email marketing', 'advertising', 'market research',
        'copywriting', 'event planning', 'strategy', 'business development', 'public relations', 'customer relationship',
        'collaboration', 'presentation', 'analytics', 'data-driven', 'decision-making', 'growth hacking', 'budgeting', 
        'market segmentation', 'product management', 'account management', 'influencer marketing', 'customer acquisition',
        'affiliate marketing', 'pr', 'trade shows', 'webinars', 'online advertising'
    ];


    // Filter tokens based on predefined skills
    const filteredSkills = tokens.filter(token => predefinedSkills.includes(token));

    // Remove duplicates and return relevant skills
    const uniqueSkills = [...new Set(filteredSkills)];
    console.log("Filtered Skills from CV:", uniqueSkills);
    return uniqueSkills;
  } catch (error) {
    console.error("Error extracting skills from CV:", error);
    return [];
  }
};

// Normalize job skills to an array if it's a string
const normalizeJobSkills = (jobSkills) => {
  console.log("Input to normalizeJobSkills:", jobSkills);

  if (typeof jobSkills === 'string') {
    // Split by commas, trim each skill, and filter out empty strings
    const normalizedSkills = jobSkills
      .split(',')  // Split by commas
      .map(skill => skill.trim().toLowerCase())  // Trim and convert to lowercase
      .filter(skill => skill.length > 0);  // Ensure no empty strings
    console.log("Normalized Job Skills:", normalizedSkills);
    return normalizedSkills;
  }

  // If jobSkills is already an array, just trim and lowercase each skill
  const normalizedSkills = jobSkills.map(skill => skill.trim().toLowerCase());
  console.log("Normalized Job Skills:", normalizedSkills);
  return normalizedSkills;
};



// Calculate skill match percentage
const calculateSkillMatch = (jobSkills, cvSkills) => {
  if (!jobSkills || jobSkills.length === 0 || cvSkills.length === 0) {
    return 0;
  }

  const normalizedJobSkills = normalizeJobSkills(jobSkills); // Normalize job skills
  const normalizedCvSkills = cvSkills.map(skill => skill.toLowerCase().trim()); // Normalize CV skills

  console.log("Normalized Job Skills:", normalizedJobSkills);
  console.log("Normalized CV Skills:", normalizedCvSkills);

  // Filter matched skills
  const matchedSkills = normalizedCvSkills.filter(cvSkill => {
    const isMatch = normalizedJobSkills.some(jobSkill => cvSkill.includes(jobSkill)); // Check if any job skill is a substring of the CV skill
    console.log(`Comparing CV Skill "${cvSkill}" with Job Skills: ${isMatch ? "Match" : "No Match"}`);
    return isMatch;
  });

  console.log("Matched Skills:", matchedSkills);

  // Calculate match percentage
  const matchPercentage = ((matchedSkills.length / normalizedJobSkills.length) * 100).toFixed(2);
  return matchPercentage;
};

// Apply for job handler
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?.userId;

    if (!jobId) return res.status(400).json({ message: "Job ID is required." });
    if (!userId) return res.status(401).json({ message: "Unauthorized request." });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.cv) return res.status(400).json({ message: "Please upload a CV before applying." });

    // Ensure correct CV path
    const cvPath = path.resolve(__dirname, "..", "uploadsCV", path.basename(user.cv));
    console.log("Expected CV Path:", cvPath);

    if (!fs.existsSync(cvPath)) {
      console.error("CV file not found at:", cvPath);
      return res.status(400).json({ message: "CV file not found. Please re-upload it." });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    // Extract skills from the CV
    const cvSkills = await extractSkillsFromCV(cvPath);
    console.log("Extracted Skills:", cvSkills);

    if (cvSkills.length === 0) {
      return res.status(400).json({ message: "No skills found in CV." });
    }

    // Ensure job.skills is an array
    const jobSkills = Array.isArray(job.skills) ? job.skills : job.skills.split(',').map(skill => skill.trim());

    // Calculate skill match
    const matchPercentage = calculateSkillMatch(jobSkills, cvSkills);
    const isShortlisted = matchPercentage >= 60 ? "Shortlisted" : "Not Shortlisted";

    // Create application entry
    const newApplication = new Application({
      userId,
      jobId,
      name: user.name,
      email: user.email,
      location: user.location || "Not Provided",
      education: user.education?.[0]?.degree || "Not Provided",
      experience: user.experience?.[0]?.role || "Not Provided",
      cv: user.cv,
      extractedSkills: cvSkills,  // Add extracted skills
      matchedSkills: cvSkills.filter(skill => {
        return normalizeJobSkills(jobSkills).includes(skill.toLowerCase()); // Correct matching logic
      }),  // Store the matched skills
      matchPercentage,
      isShortlisted,  // Update the isShortlisted status
      appliedAt: new Date(),
    });

    await newApplication.save();

    // Update job with new applicant
    await Job.findByIdAndUpdate(jobId, { 
      $push: { applicants: { userId, appliedAt: new Date() } } 
    });

    await sendApplicationSuccessEmail(user, job);
    res.status(201).json({ 
      message: "Application submitted successfully!", 
      matchPercentage, 
      isShortlisted,
      application: newApplication 
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Internal Server Error. Please try again later." });
  }
};
