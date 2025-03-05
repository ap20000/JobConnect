import React, { useState, useEffect } from "react";
import axios from "axios";

const CompanyDetails = () => {
  const [companyCount, setCompanyCount] = useState(0);
  const [managerCount, setManagerCount] = useState(0);
  const [hrCount, setHRCount] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, managerRes, hrRes, jobsRes] = await Promise.all([
          axios.get(`http://192.168.1.122:3001/user/companyCount`),
          axios.get(`http://192.168.1.122:3001/user/managerCount`),
          axios.get(`http://192.168.1.122:3001/user/hrCount`),
          axios.get(`http://192.168.1.122:3001/user/job`),
        ]);

        setCompanyCount(companyRes.data.count || 0);
        setManagerCount(managerRes.data.count || 0);
        setHRCount(hrRes.data.count || 0);
        setJobs(jobsRes.data || []);
      } catch (error) {
        setError("Failed to fetch company details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Company Details</h2>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading company details...</p>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <p>Total Registered Companies: {companyCount}</p>
          <p>Total Managers: {managerCount}</p>
          <p>Total HR Personnel: {hrCount}</p>

          <h3 className="text-xl font-semibold mt-6">Job Listings</h3>
          <table className="min-w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Job Title</th>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Posted By (HR)</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job._id} className="border">
                    <td className="px-4 py-2 border">{job.title}</td>
                    <td className="px-4 py-2 border">{job.company?.name || "No Company"}</td>
                    <td className="px-4 py-2 border">{job.postedBy?.name || "No HR Assigned"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center px-4 py-2 border">
                    No Jobs Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
