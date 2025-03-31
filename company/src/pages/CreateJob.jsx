import React, { useState, useEffect } from "react";

const CreateJob = ({ employerId }) => {
  const [jobData, setJobData] = useState({
    title: "",
    position: "",
    description: "",
    location: "",
    salary: "",
    employmentType: "Full-time",
    skills: "",
    companyName: "", // Added companyName field
  });

  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleChange = (e) => {
    setJobData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Unauthorized: Please log in first.");
      return;
    }

    setMessage("Posting job...");

    try {
      const response = await fetch("http://localhost:3001/company/createJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...jobData, postedBy: employerId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Job posted successfully!");
        setJobData({
          title: "",
          position: "",
          description: "",
          location: "",
          salary: "",
          employmentType: "Full-time",
          skills: "",
          companyName: "",
        });
      } else {
        setMessage(data.message || "Failed to post job.");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      setMessage("Error posting job. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Create a Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          onChange={handleChange}
          value={jobData.title}
          required
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          onChange={handleChange}
          value={jobData.position}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          onChange={handleChange}
          value={jobData.description}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          value={jobData.location}
          required
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          onChange={handleChange}
          value={jobData.salary}
          required
        />
        <select
          name="employmentType"
          onChange={handleChange}
          value={jobData.employmentType}
          required
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma-separated)"
          onChange={handleChange}
          value={jobData.skills}
          required
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
          value={jobData.companyName}
          required
        />
        <button type="submit">Post Job</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateJob;
