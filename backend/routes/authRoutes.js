import { Router } from "express";
import {
  jobSeeker, getUser, getAllUsers, getUserCount, deleteUser
} from "../controllers/authController.js";

import {
  registerUser, loginUser, resetPassword, updateProfile, applyForJob, getUserAppliedJobs
} from "../controllers/userController.js";

import { 
  registerCompany, registerHR, getCompanyJobs, createJob, getJobById, updateJob, deleteJob, getJobApplicants 
} from "../controllers/companyController.js";

import upload from '../config/multer.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { isManagerOrCompany, isEmployer, isJobSeeker, isAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

// Public Routes
router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.post("/reset", resetPassword);

// Job Seeker Routes
router.post("/profile", authenticateToken, isJobSeeker, jobSeeker);
router.post("/applyJob", authenticateToken, isJobSeeker, applyForJob);
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

// General User Routes
router.get("/users/:email", authenticateToken, getUser);
router.put("/users/:id", authenticateToken, updateProfile);

// Job Routes
// router.get('/jobs', getAllJobs);
router.get("/job/:jobId", getJobById);
router.put("/job/:jobId", authenticateToken, isEmployer, updateJob);
router.delete("/job/:jobId", authenticateToken, isEmployer, deleteJob);
router.get("/job/:jobId/applicants", authenticateToken, isEmployer, getJobApplicants);

export default router;
