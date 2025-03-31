import { Router } from "express";
import { registerCompany, registerHR, createJob, getAllJobs, getJobById, updateJob, deleteJob, getApplicantsForEmployer, getJobApplicants, shortlistApplicant, notlistApplicant, getShortlistedApplicants, getNotlistedApplicants } from "../controllers/companyController.js";
import { authenticateToken } from '../middleware/authMiddleware.js';
import { isManagerOrCompany, isEmployer } from '../middleware/roleMiddleware.js';
import upload from '../config/multer.js';

const router = Router();

router.post("/registerCompany", upload.single("image"), registerCompany);
router.post("/registerHr", authenticateToken, isManagerOrCompany, registerHR);
router.post("/createJob", authenticateToken, isEmployer, createJob);

router.get("/jobs", authenticateToken, getAllJobs);
router.get("/jobs/:jobId", getJobById);
router.put("/jobs/:jobId",authenticateToken,  updateJob);
router.delete("/jobs/:jobId",authenticateToken, deleteJob);
router.get("/jobs/:jobId/applicants", authenticateToken, getJobApplicants);
router.get("/shortlist/:applicationId", authenticateToken,  shortlistApplicant);
router.get("/notlist/:applicationId",authenticateToken, notlistApplicant);

router.get("/jobs/:jobId/shortlisted", authenticateToken, getShortlistedApplicants);

// Get all notlisted (rejected) applicants for a specific job
router.get("/jobs/:jobId/notlisted", authenticateToken, getNotlistedApplicants);

// router.get("/employer/applicants", authenticateToken, getApplicantsForEmployer);

export default router;
