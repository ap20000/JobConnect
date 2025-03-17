import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompanyRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    companyName: "",
    companyRole: "manager",  // Default company role is manager
    location: "",
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Store the selected image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("userName", formData.userName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("companyName", formData.companyName);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("category", "company");
    
    if (image) {
      formDataToSend.append("image", image); // Append the image file
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/company/registerCompany", 
        formDataToSend, 
        {
          withCredentials: true,  // Ensure credentials are sent
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        }
      );

      console.log("🔍 Backend Response:", response.data); // ✅ Log response

      setSuccess("Company registered successfully!");

      setTimeout(() => {
        navigate("/"); // Redirect to home after successful registration
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Something went wrong!");
      console.error("⚠️ Registration Error:", err.response?.data || err.message);
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
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default CompanyRegisterForm;
