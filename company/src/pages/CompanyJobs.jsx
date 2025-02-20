import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CompanyJobs = () => {
  const { companyId } = useParams(); // Get company ID from URL
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/company/${companyId}/jobs`);
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching jobs.");
        setLoading(false);
      }
    };

    if (companyId) {
      fetchJobs();
    }
  }, [companyId]);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Jobs Posted by Company</h2>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Employment Type:</strong> {job.employmentType}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyJobs;
