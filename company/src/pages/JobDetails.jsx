import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

const JobDetails = () => {
  // State management
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get token from localStorage
  const token = localStorage.getItem("authToken");

  // Effect to fetch jobs on component mount
  useEffect(() => {
    // Check if token exists
    if (!token) {
      setError("No token found, please login.");
      setLoading(false);
      return;
    }

    // Decode token to check validity
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);

      // Optional: Check token expiration
      if (decoded.exp * 1000 < Date.now()) {
        setError("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      // Fetch jobs if token is valid
      fetchEmployerJobs(token);
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Invalid token, please login again.");
      setLoading(false);
    }
  }, [token]);

  // Function to fetch jobs
  const fetchEmployerJobs = async (token) => {
    setLoading(true);

    try {
      // Make GET request to backend
      const response = await axios.get("http://localhost:3001/company/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);

      // Handle no jobs case
      if (!response.data.jobs || response.data.jobs.length === 0) {
        setError("No jobs found.");
        setLoading(false);
        return;
      }

      // Set jobs state
      setJobs(response.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.message || "Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        // Send DELETE request to backend
        await axios.delete(`http://localhost:3001/company/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove deleted job from UI
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

        alert("Job deleted successfully!");
      } catch (err) {
        console.error("Error deleting job:", err);
        alert("Failed to delete job.");
      }
    }
  };

  // Render loading state
  if (loading) return <p>Loading jobs...</p>;

  // Render error state
  if (error) return <p>{error}</p>;

  // Render job listings
  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>My Job Listings</h1>
      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td>{job.salary}</td>
                <td>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    style={{ backgroundColor: "red", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JobDetails;
