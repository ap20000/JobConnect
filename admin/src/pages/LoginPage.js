import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const loginUser = async () => {
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("/user/login", {
        email,
        password,
        platform: "web", // Specify platform
      });

      console.log("API Response:", response.data);

      const { token, role } = response.data;

      if (!email || !token || !role) {
        throw new Error("Invalid login response. Missing required data.");
      }

      // Store token & role in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);

      console.log("User Role:", role);

      // Redirect based on role
      if (role.toLowerCase() === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      // Improved error handling for 403 Forbidden
      console.error("Login Error:", error.response ? error.response.data : error.message);
      if (error.response?.status === 403) {
        setError(error.response?.data?.message || "Access restricted for this role on this platform");
      } else {
        setError("Login failed. Please try again.");
      }

      localStorage.clear(); // Clear stored data if login fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={loginUser}
          disabled={loading}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
