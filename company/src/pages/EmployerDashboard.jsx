import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import jwt_decode from "jwt-decode"; 
import CreateJob from "./CreateJob";
import JobApplicants from "./JobApplicants"; // Import the JobApplicants component

const EmployerDashboard = () => {
  const [employerId, setEmployerId] = useState(null);
  const [showCreateJobForm, setShowCreateJobForm] = useState(false);
  const [jobId, setJobId] = useState(null); // Track the selected job ID
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve JWT from localStorage

    if (token) {
      try {
        const decoded = jwt_decode(token); // Decode JWT
        setEmployerId(decoded.id); // Extract employer ID
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleCreateJobClick = () => {
    setShowCreateJobForm(true);
  };

  const handleJobDetailsClick = () => {
    navigate("/job-details"); // Navigate to job details page
  };

  const handleViewApplicantsClick = (jobId) => {
    setJobId(jobId); // Set the job ID
    navigate(`/job/${jobId}/applicants`); // Navigate to the applicants page for the selected job
  };

  return (
    <div>
      <h1>Employer Dashboard</h1>
      <button onClick={handleCreateJobClick}>Create a New Job</button>
      <button onClick={handleJobDetailsClick}>Manage Jobs</button>
      
      {/* Button to view applicants for a specific job */}
      <button onClick={() => handleViewApplicantsClick('specific-job-id')}>View Job Applicants</button>
      
      {showCreateJobForm ? (
        <CreateJob employerId={employerId} />
      ) : (
        <p>Welcome to your dashboard. Click the button to create a new job.</p>
      )}
    </div>
  );
};

export default EmployerDashboard;
