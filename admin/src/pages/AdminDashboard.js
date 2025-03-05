// src/components/AdminDashboard.js
import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      {/* Buttons to switch between user and company details */}
      <div className="view-toggle-buttons mb-4">
        <Link
          to="/user-details" // Link to UserDetails page
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
        >
          User Details
        </Link>
        <Link
          to="/company-details" // Link to UserDetails page
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
        >
          Company Details
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
