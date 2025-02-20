import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const JobApplicants = () => {
  const { jobId } = useParams(); // Get job ID from URL
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/job/${jobId}/applicants`);
        setApplicants(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching applicants.");
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p>Error: {error}</p>;
  if (applicants.length === 0) return <p>No applicants found for this job.</p>;

  return (
    <div>
      <h2>Job Applicants</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Education</th>
            <th>Email</th>
            <th>Experience</th>
            <th>CV</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => (
            <tr key={applicant._id}>
              <td>{applicant.userId?.name || "N/A"}</td>
              <td>{applicant.userId?.location || "N/A"}</td>
              <td>{applicant.userId?.education || "N/A"}</td>
              <td>{applicant.userId?.email || "N/A"}</td>
              <td>{applicant.userId?.experience || "N/A"} years</td>
              <td>
                {applicant.userId?.cv ? (
                  <a href={applicant.userId.cv} target="_blank" rel="noopener noreferrer">
                    Download CV
                  </a>
                ) : (
                  "No CV uploaded"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobApplicants;
