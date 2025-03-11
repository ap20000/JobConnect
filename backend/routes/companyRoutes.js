import { Router } from "express";
import { registerCompany, registerHR, createJob, getAllJobs, getJobById, updateJob, deleteJob, getApplicantsForEmployer, getJobApplicants} from "../controllers/companyController.js";
import { authenticateToken } from '../middleware/authMiddleware.js';
import { isManagerOrCompany, isEmployer } from '../middleware/roleMiddleware.js';

const router = Router();

router.post("/registerCompany", registerCompany);
router.post("/registerHr", authenticateToken, isManagerOrCompany, registerHR);
router.post("/createJob", authenticateToken, isEmployer, createJob);

router.get("/jobs", authenticateToken, getAllJobs);
router.get("/job/:jobId", getJobById);
router.put("/job/:jobId",  updateJob);
router.delete("/job/:jobId", deleteJob);
router.get("/jobs/:jobId/applicants", authenticateToken, getJobApplicants);

// router.get("/employer/applicants", authenticateToken, getApplicantsForEmployer);

export default router;
