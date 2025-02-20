import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompanyRegisterForm = ( ) => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    companyName: "",
    companyRole: "manager",  // Default company role is manager
    location: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Explicitly pass the formData along with category: "company"
      const response = await axios.post("http://localhost:3001/user/registerCompany", {
        ...formData,
        category: "company",  // Ensure the category is company
      });

      console.log("🔍 Backend Response:", response.data); // ✅ Log response

      // Ensure the backend returns a companyId
      

      
      setSuccess("Company registered successfully!");

      setTimeout(() => {
        navigate("/"); // Redirect to home after successful registration
      }, 2000);
    } catch (err) {
      console.error("⚠️ Registration Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || err.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <h2>Register Your Company</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="userName"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default CompanyRegisterForm;
