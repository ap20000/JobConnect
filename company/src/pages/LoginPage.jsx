import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with", email, password);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-600 text-white p-8">
        <img src="/handshake-icon.png" alt="Handshake" className="mb-4 w-20 h-20" />
        <h2 className="text-2xl font-bold">Welcome Back.</h2>
        <p className="text-sm mt-2">You are just one step away to your feed.</p>
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
          />
          
          <label className="block font-semibold mt-4">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Keep me logged in</span>
            </div>
            <Link to="/forgot-password" className="text-sm text-blue-500">Forgot Password?</Link>
          </div>
          
          <button
            type="submit"
            className="w-full bg-black text-white p-2 mt-4 rounded"
          >
            Sign Up
          </button>
        </form>
        
        <p className="text-sm mt-4">Or, Use social media to sign in</p>
        <div className="flex space-x-4 mt-3">
          <button className="p-2 bg-gray-300 rounded">G</button>
          <button className="p-2 bg-gray-300 rounded">A</button>
          <button className="p-2 bg-gray-300 rounded">F</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
