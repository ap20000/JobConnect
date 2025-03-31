import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
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

        const companyUsers = response.data.filter((user) => user.category === "company");
        setCompanies(companyUsers);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Companies</h1>
        <p className="text-gray-600 mt-2">View, edit, and delete companies.</p>

        {/* Companies List */}
        <div className="mt-6">
          {companies.length > 0 ? (
            <ul className="list-none space-y-4">
              {companies.map((company) => (
                <li key={company._id} className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-700">{company.companyName || "N/A"}</h2>
                    <p className="text-gray-600">{company.email}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => navigate(`/edit-company/${company._id}`)}
                      className="bg-blue-500 text-white px-4 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No companies found.</p>
          )}
        </div>

        <button
          onClick={() => navigate("/admin-dashboard")}
          className="w-full mt-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CompaniesPage;
