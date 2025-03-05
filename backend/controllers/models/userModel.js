import mongoose from "mongoose";

const userModel = new mongoose.Schema({

  // Basic fields common for both Job Seeker and Company
  name: { type: String},
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String },
  role: { type: String, enum: ["admin", "user"],default: 'user' }, // Defaults to 'user'
image: { 
  type: String  // Default profile image path
},
location: { 
  type: String // Default profile image path
},
category: { 
  type: String, enum: ["job_seeker", "company"]
   // Default to 'job_seeker' if not provided
},

companyRole: {
  type: String,
  enum: ["manager", "hr"], // ✅ Added "hr" as a valid value

},

// Fields specific to Job Seeker

education: [
  {
    school: { type: String },
    degree: { type: String },
    years: { type: String }
  }
],
skills: { 
  type: [String], 
  default: []  // Default to an empty array if no skills are provided
},
experience: [
  {
    role: { type: String },
    companyName: { type: String },
    years: { type: String }
  }
],


companyName: { 
  type: String, 
  default: 'Not Provided' 
},


  // Date of registration or profile creation
  createdAt: { type: Date, default: Date.now },

  // Optionally add some status or verification flags
  isVerified: { type: Boolean, default: false }, // Can be used for account verification

});

// Creating the model from schema
const user = mongoose.model("User", userModel);

export default user;
