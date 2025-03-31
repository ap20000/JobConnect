import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-lg mt-4">Welcome, Admin!</p>
      
      <div className="mt-6 space-x-4">
        <button
          onClick={() => navigate("/users")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Manage Users
        </button>
        
        <button
          onClick={() => navigate("/companies")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Manage Companies
        </button>
      </div>
      
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;