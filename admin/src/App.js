import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';
import AdminDashboard from '../src/pages/AdminDashboard';
import UserDetails from '../src/pages/UserDetaiils';
import CompanyDetails from '../src/pages/CompanyDetails';
import axios from "axios";
axios.defaults.baseURL = "http://100.64.219.21:3001";
axios.defaults.withCredentials = true;
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
         <Route path="/admin-dashboard" element={<AdminDashboard />} />
         <Route path="/user-details" element={<UserDetails />} />
         <Route path="/company-details" element={<CompanyDetails />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;