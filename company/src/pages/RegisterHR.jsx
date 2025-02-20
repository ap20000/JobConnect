import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const RegisterHR = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    location: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwt_decode(token);
      return decoded.exp * 1000 < Date.now(); // Convert expiration time to milliseconds
    } catch (error) {
      console.error("Token decoding error:", error);
      return true; // Treat invalid token as expired
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Get token from localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("No token found. Please log in first.");
      return;
    }

    console.log("Token found:", token);

    // Check if the token is expired
    if (isTokenExpired(token)) {
      setError("Session expired. Please log in again.");
      localStorage.removeItem("authToken"); // Clear expired token
      return;
    }

    // Decode token and check user role
    try {
      const decodedToken = jwt_decode(token);
      console.log("Decoded Token:", decodedToken);

      // Update this condition to check both role and companyRole
      if (decodedToken.role !== "manager" && decodedToken.companyRole !== "manager") {
        setError("You are not authorized to register HR.");
        return;
      }
    } catch (error) {
      setError("Invalid token. Please log in again.");
      return;
    }

    try {
      // Send request to register HR
      const res = await axios.post(
        "http://localhost:3001/company/registerHr",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success response
      setSuccess(res.data.message);
      setTimeout(() => {
        navigate("/"); // Redirect after successful registration
      }, 2000);
    } catch (err) {
      // Handle errors properly
      if (err.response) {
        setError(err.response.data.message || "An error occurred.");
      } else if (err.request) {
        setError("Network error. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      <h2>Register HR</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <button type="submit">Register HR</button>
      </form>
    </div>
  );
};

export default RegisterHR;
