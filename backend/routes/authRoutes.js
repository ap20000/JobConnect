import { Router } from "express";
import {
  
  
 
  jobSeeker,createJob,getAllJobs,getUser,getAllUsers,getUserCount,deleteUser,

} from "../controllers/authController.js";
import {
  registerUser,loginUser,resetPassword,updateProfile,
} from "../controllers/userController.js";

import { registerCompany,registerHR, getCompanyJobs, createJob } from "../controllers/companyController.js";
import upload from '../config/multer.js';

import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Route handlers
router.post("/register",upload.single("image"),  registerUser);
router.post("/login", loginUser);
router.put('/users/:id', updateProfile);
router.post("/reset", resetPassword);
router.post("/profile", jobSeeker);
router.post("/job", createJob);
router.get('/jobs', getAllJobs);
 router.get("/usersAll", getAllUsers);
router.get("/users/:email",authenticateToken, getUser);
router.get("/userCount", getUserCount); // Add the route to get the user count
router.delete('/user/:id', deleteUser);
router.post("/registerCompany", registerCompany);
router.post("/regsiterHr", registerHR);
router.post("/createJob", authenticateToken, createJob); // Ensure only authenticated employers can post jobs
router.get("/company/:companyId/jobs", getCompanyJobs);



export default router;
