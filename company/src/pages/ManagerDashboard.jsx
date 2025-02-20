import React from "react";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleRegisterHR = () => {
    navigate("/register-hr"); // Navigate to HR registration page
  };

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to the manager's panel. Manage your team efficiently.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Team Performance</h2>
          <p className="text-gray-500">Track and improve your team's performance metrics.</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Project Overview</h2>
          <p className="text-gray-500">View progress and deadlines of active projects.</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <p className="text-gray-500">View and manage employees under your supervision.</p>
        </div>
      </div>

      {/* Register HR Button */}
      <div className="mt-6">
        <button 
          onClick={handleRegisterHR} 
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          Register HR
        </button>
      </div>
    </div>
  );
};

export default ManagerDashboard;
