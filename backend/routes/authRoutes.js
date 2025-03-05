import { Router } from "express";
import { uploadsCV } from "../middleware/uploadMiddleware.js";  // Import the existing multer instance
import multer from "multer";

import {
  jobSeeker, getUser, getAllUsers, getUserCount, deleteUser, getCompanyCount, getManagerCount, getHRCount, getAllJobsWithCompanyAndHR
} from "../controllers/authController.js";

import {
  registerUser, loginUser, resetPassword, updateProfile, applyForJob, getUserAppliedJobs, AllJobs, completeProfile
} from "../controllers/userController.js";

import { 
  registerCompany, registerHR, getCompanyJobs, createJob, getJobById, updateJob, deleteJob, getJobApplicants 
} from "../controllers/companyController.js";

import upload from '../config/multer.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { isManagerOrCompany, isEmployer, isJobSeeker, isAdmin } from '../middleware/roleMiddleware.js';

const router = Router();
// const storage = multer.memoryStorage(); // Stores files in memory (you can use diskStorage instead)
// const upload = multer({ storage: storage });
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });



// Public Routes
router.post("/register",  registerUser);
router.post("/login", loginUser);
router.post("/reset", resetPassword);
router.post("/completeProfile/:userId", upload.single("image"), completeProfile); 

// Job Seeker Routes
router.get("/users", authenticateToken, getUser);
router.post("/profile", authenticateToken, isJobSeeker, jobSeeker);
router.post("/applyJob", authenticateToken, uploadsCV.single("cv"), applyForJob);
router.get("/user/appliedJobs/:userId", authenticateToken, isJobSeeker, getUserAppliedJobs);

// Employer Routes
router.post("/registerCompany", registerCompany);
router.post("/registerHr", authenticateToken, isManagerOrCompany, registerHR);
router.post("/createJob", authenticateToken, isEmployer, createJob);
router.get("/company/:companyId/jobs", authenticateToken, isEmployer, getCompanyJobs);

// Admin Routes
router.get("/usersAll", authenticateToken, isAdmin, getAllUsers);
router.get("/userCount", authenticateToken, isAdmin, getUserCount);
router.delete('/user/:id', authenticateToken, isAdmin, deleteUser);

router.get("/companyCount", getCompanyCount);
router.get("/managerCount", getManagerCount);
router.get("/hrCount", getHRCount);
router.get("/allJob", getAllJobsWithCompanyAndHR);

// General User Routes
router.get("/getUser", authenticateToken, getUser);
router.put("/users/:id", authenticateToken, updateProfile);
router.get("/job", AllJobs);
// Job Routes
// router.get('/jobs', getAllJobs);
router.get("/job/:jobId", getJobById);
router.put("/job/:jobId", authenticateToken, isEmployer, updateJob);
router.delete("/job/:jobId", authenticateToken, isEmployer, deleteJob);
router.get("/job/:jobId/applicants", authenticateToken, isEmployer, getJobApplicants);

export default router;
