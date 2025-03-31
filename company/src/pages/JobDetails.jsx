import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const JobDetails = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editJob, setEditJob] = useState(null);
  const [updatedJob, setUpdatedJob] = useState({});
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('No token found, please login.');
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }

      fetchEmployerJobs(token);
    } catch (err) {
      setError('Invalid token, please login again.');
      setLoading(false);
    }
  }, [token]);

  const fetchEmployerJobs = async (token) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:3001/company/jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data || !response.data.jobs || response.data.jobs.length === 0) {
        setError('No jobs found.');
      } else {
        setJobs(response.data.jobs);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs.');
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`http://localhost:3001/company/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        alert('Job deleted successfully!');
      } catch (err) {
        alert('Failed to delete job.');
      }
    }
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/jobs/${jobId}/applicants`);
  };

  const handleEditJob = (job) => {
    setEditJob(job);
    setUpdatedJob({ ...job });
  };

  const handleUpdateJob = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/company/jobs/${jobId}`,
        updatedJob,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === editJob._id ? response.data.job : job))
      );

      setEditJob(null);
      alert('Job updated successfully!');
    } catch (err) {
      alert('Failed to update job.');
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>My Job Listings</h1>
      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Title</th>
              
              <th>Location</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                
                <td>{job.location}</td>
                <td>{job.salary}</td>
                <td>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    style={{ backgroundColor: 'red', color: 'white' }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewApplicants(job._id)}
                    style={{ backgroundColor: 'blue', color: 'white', marginLeft: '10px' }}
                  >
                    View Applicants
                  </button>
                  <button
                    onClick={() => handleEditJob(job)}
                    style={{ backgroundColor: 'green', color: 'white', marginLeft: '10px' }}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editJob && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h2>Edit Job</h2>
          <input
            type="text"
            value={updatedJob.title}
            onChange={(e) => setUpdatedJob({ ...updatedJob, title: e.target.value })}
            placeholder="Job Title"
          />
          <input
            type="text"
            value={updatedJob.location}
            onChange={(e) => setUpdatedJob({ ...updatedJob, location: e.target.value })}
            placeholder="Location"
          />
          <input
            type="number"
            value={updatedJob.salary}
            onChange={(e) => setUpdatedJob({ ...updatedJob, salary: e.target.value })}
            placeholder="Salary"
          />
          <button onClick={handleUpdateJob} style={{ backgroundColor: 'green', color: 'white' }}>
            Save Changes
          </button>
          <button onClick={() => setEditJob(null)} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
