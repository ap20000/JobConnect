import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicantsList = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');
  const jobId = window.location.pathname.split('/')[2]; // Extract jobId from the URL

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/company/jobs/${jobId}/applicants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplicants(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch applicants');
        setLoading(false);
      }
    };

    if (jobId && token) {
      fetchApplicants();
    } else {
      setError('No job ID or token found');
      setLoading(false);
    }
  }, [jobId, token]);

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-4">
      <h2 className="text-xl font-semibold mb-4">Applicants for This Job</h2>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Email</th>
              <th className="px-4 py-2 text-left border-b">Location</th>
              <th className="px-4 py-2 text-left border-b">CV</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant._id} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-2 border-b">{applicant.userId?.name || 'Unknown'}</td>
                <td className="px-4 py-2 border-b">{applicant.userId?.email || 'N/A'}</td>
                <td className="px-4 py-2 border-b">{applicant.userId?.location || 'Not Provided'}</td>
                <td className="px-4 py-2 border-b">
                  {applicant.userId?.cv && (
                    <a
                      href={`http://localhost:3001/${applicant.userId.cv}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View CV
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicantsList;
