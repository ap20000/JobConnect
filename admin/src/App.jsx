import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AdminDashboard from "../pages/AdminDashboard";
import UsersPage from "../pages/UsersPage";
import CompaniesPage from "../pages/CompaniesPage";


import axios from "axios";


// axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.baseURL = "http://192.168.1.122:3001";
axios.defaults.withCredentials = true;

function App() {
   console.log('App component rendered');
  return (
    <Router>
      <Routes>
        {/* First page (Login Page) */}
        <Route path="/" element={<LoginPage />} />

        {/* Other Pages */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
      
       

        {/* Fallback Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
