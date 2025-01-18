import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../src/pages/LoginPage";
import CompanyRegisterForm from "./pages/CompanyRegisterForm";
import JobCreatorDashboard from "./pages/JobCreatorDashboard ";
import JobManagerDashboard from "./pages/JobManagerDashboard ";
import CompanyManagerRegister from "./pages/CompanyManagerRegister";
import axios from "axios"; 

// axios.defaults.baseURL = "http://192.168.1.8:3001";
axios.defaults.baseURL = "http://100.64.207.248:3001";
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes for your pages */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/" element={<CompanyRegisterForm />} />
        <Route path="/creator-dashboard" element={<JobCreatorDashboard />} />
        <Route path="/manager-dashboard" element={<JobManagerDashboard />} />
        <Route path="/manager-register" element={<CompanyManagerRegister />} />
        {/* Fallback route for undefined paths */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}


export default App
