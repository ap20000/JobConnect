import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job", // Reference to the Job model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  education: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
  },
  cv: {
    type: String, // Store the file path or URL of the uploaded CV
  },
  extractedSkills: {
    type: [String], // Store skills dynamically extracted from the CV
    default: [],
  },
  matchedSkills: {
    type: [String], // Store the skills that match with job requirements
    default: [],
  },
  matchPercentage: {
    type: Number, // Store the skill match percentage
    default: 0,
  },
  isShortlisted: {
    type: String, // "Shortlisted" or "Not Shortlisted"
    default: "Not Shortlisted",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
