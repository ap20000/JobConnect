import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // To access the jobId from the URL

const JobApplicants = () => {
  const { jobId } = useParams(); // Extract jobId from the URL
  const [applicants, setApplicants] = useState([]); // State to hold the applicants data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  const token = localStorage.getItem("token"); // Get token from local storage

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/company/job/${jobId}/applicants`, // Update with correct API endpoint
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in request header
            },
          }
        );
        setApplicants(response.data); // Set applicants data
        setLoading(false);
      } catch (err) {
        setError("Error fetching applicants.");
        setLoading(false);
      }
    };

    if (token) {
      fetchApplicants();
    } else {
      setError("Unauthorized. Please log in.");
      setLoading(false);
    }
  }, [jobId, token]);

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Applicants for Job: {jobId}</h1>
      {applicants.length === 0 ? (
        <p>No applicants for this job.</p>
      ) : (
        <ul>
          {applicants.map((applicant) => (
            <li key={applicant._id}>
              <h3>{applicant.userId?.name}</h3>
              <p>Email: {applicant.userId?.email}</p>
              <p>Experience: {applicant.userId?.experience}</p>
              <p>Location: {applicant.userId?.location}</p>
              <p>Education: {applicant.userId?.education}</p>
              {applicant.userId?.cv && (
                <a href={applicant.userId.cv} target="_blank" rel="noopener noreferrer">
                  View CV
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobApplicants;
