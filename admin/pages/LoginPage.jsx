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
    setError("");

    try {
      localStorage.removeItem("authToken");

      const response = await axios.post(
        "/user/login", 
        { email, password, platform: "web" },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { token, role } = response.data;
        if (role !== "admin") {
            setError("Access denied. Only admins can log in.");
            return;
        }
        localStorage.setItem("authToken", token);

        if (role === "admin") {
          navigate("/admin-dashboard");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Invalid email or password.");
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-700 text-white p-8">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-sm mt-2">Manage users, jobs, and settings.</p>
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <h2 className="text-2xl font-bold">Admin Sign In</h2>
        <form className="w-full max-w-sm mt-6" onSubmit={handleSubmit}>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter your admin email"
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
      </div>
    </div>
  );
};

export default LoginPage;
