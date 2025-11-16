// src/Admin.js
import { useState, useEffect } from "react";
import { saveJobsToDB, getJobsFromDB } from "./utils/indexedDB";
import axios from "axios";
import "./Admin.css";

export default function Admin() {
  const [jobData, setJobData] = useState({
    position: "",
    company: "",
    location: "",
    workType: "",
    expectedYear: "",
    description: "",
    vacancies: "",
    salary: "",
    postedTime: new Date(),
    skills: [],
    education: ""
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const API_BASE = "https://jobportal-backend-xoym.onrender.com";

  useEffect(() => {
    getJobsFromDB().then((data) => setSubmittedData(data));
  }, []);

  useEffect(() => {
    if (submittedData.length > 0) saveJobsToDB([...submittedData]);
  }, [submittedData]);

  const jobDescriptions = {
    "Software Engineer": "Designs, develops, and optimizes software applications...",
    "Frontend Developer": "Builds responsive, dynamic, and user-friendly interfaces...",
    "Backend Developer": "Handles business logic, databases, and API development...",
    "Full Stack Developer": "Combines frontend and backend development to create complete web applications...",
    "DevOps Engineer": "Automates development, testing, and deployment pipelines...",
    "Data Scientist": "Processes and analyzes large datasets to extract meaningful insights...",
    "Machine Learning Engineer": "Builds, trains, and deploys machine learning models...",
    "Cyber Security Analyst": "Protects systems, networks, and data from security threats...",
    "Cloud Engineer": "Designs and manages cloud-based solutions...",
    "UI/UX Designer": "Creates visually appealing and user-friendly digital experiences..."
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
      description: name === "position" ? jobDescriptions[value] || "" : prev.description
    }));
  };

  const handleSkillsChange = (e) => {
    const selectedSkill = e.target.value;
    if (selectedSkill && !jobData.skills.includes(selectedSkill)) {
      setJobData((prev) => ({ ...prev, skills: [...prev.skills, selectedSkill] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobData.position || !jobData.company) {
      alert("Please fill required fields.");
      return;
    }
    let updatedData = [...submittedData];
    if (editingIndex !== null) updatedData[editingIndex] = { ...jobData };
    else updatedData.push(jobData);
    setSubmittedData(updatedData);
    setEditingIndex(null);
    setJobData({
      position: "",
      company: "",
      location: "",
      workType: "",
      expectedYear: "",
      description: "",
      vacancies: "",
      salary: "",
      skills: [],
      education: ""
    });
  };

  const handleDelete = (index) => {
    const updatedJobs = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedJobs);
  };

  const handleEdit = (index) => {
    setJobData({ ...submittedData[index] });
    setEditingIndex(index);
  };

  // POST job to backend with duplicate prevention + expiry prompt
  const handlePostJob = async (job) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login as admin to post jobs.");
        return;
      }

      // ask admin for expiry hours (optional)
      let input = window.prompt("Enter expiry in hours (leave blank for no expiry):", "24");
      let expiresInHours = null;
      if (input !== null && input.trim() !== "") {
        const num = Number(input);
        if (isNaN(num) || num <= 0) {
          alert("Invalid expiry hours. Please enter a positive number.");
          return;
        }
        expiresInHours = num;
      }

      const formattedJob = {
        ...job,
        postedTime: new Date().toISOString(),
        expectedYear: Number(job.expectedYear),
        vacancies: Number(job.vacancies || 0),
        skills: Array.isArray(job.skills) ? job.skills : (typeof job.skills === "string" ? job.skills.split(",").map(s => s.trim()).filter(Boolean) : []),
        expiresInHours
      };

      const res = await axios.post(`${API_BASE}/jobs`, formattedJob, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // success
      const savedJob = res.data.job;
      alert("Job posted successfully!");

      // Save to localStorage (homePostedJobs) with server response (so we have id & expiresAt)
      const storedJobs = JSON.parse(localStorage.getItem("homePostedJobs")) || [];
      storedJobs.unshift(savedJob);
      localStorage.setItem("homePostedJobs", JSON.stringify(storedJobs));

    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert("Error posting job: " + msg);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="form-title">Job Details Form</h2>
      {/* form (same as before) */}
      <form onSubmit={handleSubmit} className="job-form">
        {/* ... same fields as you already have ... */}
        {/* keep your existing JSX for selects/textareas etc. */}
        <button type="submit">{editingIndex !== null ? "Update Job" : "Submit Job"}</button>
      </form>

      <div className="submitted-section">
        {submittedData.length > 0 ? submittedData.map((job, idx) => (
          <div key={idx} className="job-card">
            <h3>{job.position} at {job.company}</h3>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Work Type:</strong> {job.workType}</p>
            <p><strong>Skills:</strong> {job.skills.join(", ")}</p>
            <p><strong>Education:</strong> {job.education}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Vacancies:</strong> {job.vacancies}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <p><strong>Expected Year of Joining:</strong> {job.expectedYear}</p>
            <div className="button-container">
              <button onClick={() => handleEdit(idx)}>Edit</button>
              <button onClick={() => handleDelete(idx)}>Delete</button>
              <button onClick={() => handlePostJob(job)}>Post</button>
            </div>
          </div>
        )) : <p>No jobs posted yet.</p>}
      </div>
    </div>
  );
}
