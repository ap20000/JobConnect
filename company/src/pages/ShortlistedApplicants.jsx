import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const ShortlistedApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/company/jobs/${jobId}/shortlisted`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApplicants(response.data.applicants);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch shortlisted applicants');
        setLoading(false);
      }
    };

    if (jobId) {
      fetchShortlisted();
    }
  }, [jobId, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-4">
      <h2 className="text-xl font-semibold mb-4">Shortlisted Applicants</h2>
      {applicants.length === 0 ? (
        <p>No shortlisted applicants.</p>
      ) : (
        <ul>
          {applicants.map((applicant) => (
            <li key={applicant._id} className="py-2">
              <strong>{applicant.userId?.name || 'No name available'}</strong>
              <div>{applicant.userId?.location || 'No location available'}</div>
              <a
                href={applicant.userId?.cv || '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                {applicant.applicant?.cv ? 'View CV' : 'CV not available'}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShortlistedApplicants;
