import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../src/pages/LoginPage";
import CompanyRegisterForm from "../src/pages/CompanyRegisterForm";
import JobCreatorDashboard from "../src/pages/JobCreatorDashboard ";
import JobManagerDashboard from "../src/pages/JobManagerDashboard ";
import CompanyManagerRegister from "../src/pages/CompanyManagerRegister";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<CompanyRegisterForm />} />
        <Route path="/CompanyManagerRegister" element={<CompanyManagerRegister />} />
         <Route path="LoginPage" element={<LoginPage />} />
        <Route path="/job-creator-dashboard" element={<JobCreatorDashboard />} />
        <Route path="/job-manager-dashboard" element={<JobManagerDashboard />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
