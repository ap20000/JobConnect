import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../src/pages/LoginPage";
import CompanyRegisterForm from "../src/pages/CompanyRegisterForm";
import JobCreatorDashboard from "../src/pages/CreateJob";
import RegisterHR from "../src/pages/RegisterHR";
import JobDetails from "../src/pages/JobDetails";
import CreateJob from "../src/pages/CreateJob";
import EmployerDashboard from "../src/pages/EmployerDashboard";
import JobApplicants from "../src/pages/JobApplicants";

import axios from "axios";
import ManagerDashboard from "../src/pages/ManagerDashboard";

axios.defaults.baseURL = "http://localhost:3001";
// axios.defaults.baseURL = "http://100.64.218.51:3002";
axios.defaults.withCredentials = true;

function App() {
   console.log('App component rendered');
  return (
    <Router>
      <Routes>
        {/* First page (Login Page) */}
        <Route path="/" element={<LoginPage />} />

        {/* Other Pages */}
        <Route path="/register-company" element={<CompanyRegisterForm />} />
        <Route path="/creator-dashboard" element={<JobCreatorDashboard />} />
        <Route path="/register-hr" element={<RegisterHR />} />
        <Route path="/job-details" element={<JobDetails />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/job/:jobId/applicants" element={<JobApplicants />} />

        {/* Fallback Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
