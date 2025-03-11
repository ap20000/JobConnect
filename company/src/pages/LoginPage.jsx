import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error on each submit

    try {
      localStorage.removeItem("authToken"); // Clear any previous token

      // Make the API request to the backend (use full URL)
      const response = await axios.post(
        "http://localhost:3001/user/login",   // ✅ Explicit backend URL
        { email, password, platform: "web" },
        {
          withCredentials: true, // ✅ Required for cookies/session handling
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { token, role, companyRole } = response.data;

        // ✅ Store token securely
        localStorage.setItem("authToken", token);

        // ✅ Redirect based on role
        if (companyRole === "hr") {
          navigate("/employer-dashboard");
        } else {
          navigate("/manager-dashboard");
        }
      }
    } catch (err) {
      console.error("Login error:", err);

      // ✅ Handle different error types
      if (err.response) {
        setError(err.response.data?.message || "Invalid email or password.");
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleRegister = () => {
    navigate("/register-company");
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-600 text-white p-8">
        <img src="/handshake-icon.png" alt="Handshake" className="mb-4 w-20 h-20" />
        <h2 className="text-2xl font-bold">Welcome Back.</h2>
        <p className="text-sm mt-2">You are just one step away from your feed.</p>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <h2 className="text-2xl font-bold">Sign In</h2>
        <form className="w-full max-w-sm mt-6" onSubmit={handleSubmit}>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block font-semibold mt-4">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="w-full bg-black text-white p-2 mt-4 rounded">
            Sign In
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        {/* Register Button */}
        <div className="mt-4">
          <button
            onClick={handleRegister}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
