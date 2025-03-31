import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersPage = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No token found. Redirecting to login...");
          return;
        }

        const response = await axios.get("/user/usersAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const users = response.data;
        const seekers = users.filter(user => user.category === "job_seeker");
        const companyUsers = users.filter(user => user.category === "company");

        setJobSeekers(seekers);
        setCompanies(companyUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobSeekers(jobSeekers.filter((user) => user._id !== userId));
      setCompanies(companies.filter((user) => user._id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>

      {/* Job Seekers Table */}
      <h2 className="text-xl font-semibold mt-4">Job Seekers</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Location</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobSeekers.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.location}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Companies Table */}
      
    </div>
  );
};

export default UsersPage;