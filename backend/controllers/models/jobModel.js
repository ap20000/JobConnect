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
    type: mongoose.Schema.Types.ObjectId, // Updated to ObjectId for referencing the User model (or a Company model)
    ref: 'User', // Reference to the User model (if companies are users)
    
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
    ref: 'User', // Assuming you have an Employer model
  },
  applicants: [
    {
      userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", // Fixed the extra space here
        required: true 
      },
     
      appliedAt: { type: Date, default: Date.now },
    },
  ],
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
