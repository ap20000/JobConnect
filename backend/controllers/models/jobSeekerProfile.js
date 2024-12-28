import mongoose from "mongoose";

// Define the JobSeekerProfile Schema
const jobSeekerProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
 
  location: { type: String },
  collegeName: { type: String, required: true }, // College name field
  year: { type: Number, required: true }, // Year of graduation or enrollment
  subject: { type: String, required: true },
  skills: { type: String },
  experience: [{ company: String, role: String, years: Number }],
  resume: { type: String },
  image: { type: String },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  appliedJobs: [{ job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }, status: String }], // status: 'applied', 'interview', 'hired', etc.
});

const JobSeekerProfile = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);

export default JobSeekerProfile;
