import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile', // Assuming you have an Employer model
  
  },
  applicants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user ", required: true },
      resume: { type: String, required: true },
      coverLetter: { type: String, required: true },
      appliedAt: { type: Date, default: Date.now },
    },
  ],
});

const Job = mongoose.model('Job', jobSchema);


export default Job;
