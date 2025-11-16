
import { useState, useEffect } from "react";
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
    skills: [],
    education: ""
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const API_BASE = "https://jobportal-backend-xoym.onrender.com";

  // Load jobs from backend on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/jobs`);
      setSubmittedData(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setSubmittedData([]);
    }
  };

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
    setJobData(prev => ({
      ...prev,
      [name]: value,
      description: name === "position" ? jobDescriptions[value] || prev.description : prev.description
    }));
  };

  const handleSkillsChange = (e) => {
    const skill = e.target.value;
    if (skill && !jobData.skills.includes(skill)) {
      setJobData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobData.position || !jobData.company) {
      alert("Please fill required fields.");
      return;
    }

    const formattedJob = {
      ...jobData,
      postedTime: new Date().toISOString(),
      expectedYear: Number(jobData.expectedYear),
      vacancies: Number(jobData.vacancies || 0),
      skills: Array.isArray(jobData.skills) ? jobData.skills : jobData.skills.split(",").map(s => s.trim())
    };

    try {
      if (editingJobId) {
        // Update job
        await axios.put(`${API_BASE}/jobs/${editingJobId}`, formattedJob);
        alert("Job updated successfully!");
      } else {
        // Post new job
        await axios.post(`${API_BASE}/jobs`, formattedJob);
        alert("Job posted successfully!");
      }

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
      setEditingJobId(null);
      fetchJobs(); // refresh list
    } catch (err) {
      console.error("Error posting/updating job:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (job) => {
    setJobData({ ...job });
    setEditingJobId(job._id);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${API_BASE}/jobs/${jobId}`);
      alert("Job deleted successfully!");
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="form-title">Job Details Form</h2>

      <form onSubmit={handleSubmit} className="job-form">
        {/* Position */}
        <div className="form-group">
          <label>Position:</label>
          <select name="position" value={jobData.position} onChange={handleChange} required>
            <option value="">Select Position</option>
            {Object.keys(jobDescriptions).map(pos => <option key={pos} value={pos}>{pos}</option>)}
          </select>
        </div>

        {/* Company */}
        <div className="form-group">
          <label>Company:</label>
          <select name="company" value={jobData.company} onChange={handleChange} required>
            <option value="">Select Company</option>
            {["Google","Amazon","Microsoft","Facebook","Apple","Netflix","Tesla","IBM","Adobe","Salesforce"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Expected Year */}
        <div className="form-group">
          <label>Expected Year of Joining:</label>
          <select name="expectedYear" value={jobData.expectedYear} onChange={handleChange} required>
            <option value="">Select Year</option>
            {Array.from({ length: 9 }, (_, i) => 2020 + i).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Work Type */}
        <div className="form-group">
          <label>Work Type:</label>
          <select name="workType" value={jobData.workType} onChange={handleChange} required>
            <option value="">Select Work Type</option>
            {["Full-time","Internship","Fresher","Remote","Hybrid","Work from Office"].map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location:</label>
          <select name="location" value={jobData.location} onChange={handleChange} required>
            <option value="">Select Location</option>
            {["Delhi, Delhi","Pune, Maharashtra","Kolkata, West Bengal","Chandigarh, Punjab","Ahmedabad, Gujarat","Jaipur, Rajasthan","Indore, Madhya Pradesh","Coimbatore, Tamil Nadu","Visakhapatnam, Andhra Pradesh","Lucknow, Uttar Pradesh","Bhubaneswar, Odisha","Thiruvananthapuram, Kerala","Nagpur, Maharashtra","Mysore, Karnataka","Surat, Gujarat"].map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        {/* Skills */}
        <div className="form-group">
          <label>Skills:</label>
          <select onChange={handleSkillsChange}>
            <option value="">Select Skill</option>
            {["React.js","Node.js","MongoDB","Express.js","HTML","CSS","JavaScript","Python","Java","C++"].map(skill => <option key={skill} value={skill}>{skill}</option>)}
          </select>
          <div className="selected-skills">{jobData.skills.join(", ")}</div>
        </div>

        {/* Education */}
        <div className="form-group">
          <label>Education:</label>
          <select name="education" value={jobData.education} onChange={handleChange} required>
            <option value="">Select Education</option>
            {["B.Tech","M.Tech","BCA","MCA"].map(ed => <option key={ed} value={ed}>{ed}</option>)}
          </select>
        </div>

        {/* Salary */}
        <div className="form-group">
          <label>Salary:</label>
          <select name="salary" value={jobData.salary} onChange={handleChange} required>
            <option value="">Select Salary</option>
            {["10,000-50,000","50,000-1,00,000","1,00,000-1,50,000","1,50,000-2,00,000","2,00,000-3,00,000","3,00,000-5,00,000","5,00,000+"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={jobData.description} onChange={handleChange} required />
        </div>

        {/* Vacancies */}
        <div className="form-group">
          <label>Vacancies:</label>
          <input type="number" name="vacancies" value={jobData.vacancies} onChange={handleChange} required />
        </div>

        <button type="submit">{editingJobId ? "Update Job" : "Post Job"}</button>
      </form>

      {/* Job List */}
      <div className="submitted-section">
        {submittedData.length > 0 ? submittedData.map(job => (
          <div key={job._id} className="job-card">
            <h3>{job.position} at {job.company}</h3>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Work Type:</strong> {job.workType}</p>
            <p><strong>Skills:</strong> {job.skills.join(", ")}</p>
            <p><strong>Education:</strong> {job.education}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Vacancies:</strong> {job.vacancies}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <p><strong>Expected Year:</strong> {job.expectedYear}</p>
            <div className="button-container">
              <button onClick={() => handleEdit(job)}>Edit</button>
              <button onClick={() => handleDelete(job._id)}>Delete</button>
            </div>
          </div>
        )) : <p>No jobs posted yet.</p>}
      </div>
    </div>
  );
}  and import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from "axios";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notInterestedJobs, setNotInterestedJobs] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [randomUser, setRandomUser] = useState(null);

  const navigate = useNavigate();
  const API_BASE = "https://jobportal-backend-xoym.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios.get(`${API_BASE}/me`)
      .then(res => {
        if (res.data?.authenticated) {
          setUser(res.data.user || null);
          const role = res.data.role || localStorage.getItem("role");
          setIsAdmin(role === "admin");
          if (role) localStorage.setItem("role", role);
        } else {
          localStorage.clear();
          navigate("/login");
        }
      })
      .catch(err => {
        console.error("Token validation failed:", err);
        localStorage.clear();
        navigate("/login");
      });

    // Load saved/not interested from localStorage
    setSavedJobs(JSON.parse(localStorage.getItem("savedJobs")) || []);
    setNotInterestedJobs(JSON.parse(localStorage.getItem("notInterestedJobs")) || []);
  }, [navigate]);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE}/jobs`);
        const normalizedJobs = res.data.map(job => ({
          ...job,
          skills: Array.isArray(job.skills) ? job.skills : (job.skills ? job.skills.split(",").map(s => s.trim()) : []),
          isExpired: job.expiresAt ? (new Date() > new Date(job.expiresAt)) : false
        }));
        setJobs(normalizedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      }
    };
    fetchJobs();
  }, []);

  const toggleSaveJob = (job) => {
    const jobId = job._id;
    let updated = [...savedJobs];
    const index = savedJobs.findIndex(j => j._id === jobId);
    if (index === -1) updated.push(job);
    else updated.splice(index, 1);
    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };

  const isJobSaved = (job) => savedJobs.some(j => j._id === job._id);

  const handleNotInterested = (jobId) => {
    const updated = [...notInterestedJobs, jobId];
    setNotInterestedJobs(updated);
    localStorage.setItem("notInterestedJobs", JSON.stringify(updated));
  };

  const handleApplyClick = (job) => {
    if (job.isExpired) {
      alert("This application is no longer available (expired).");
      return;
    }
    navigate("/apply", { state: { job } });
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("https://randomuser.me/api/");
      setRandomUser(response.data.results[0]);
      setShowLogoutModal(true);
    } catch (error) {
      console.error("Error fetching random user:", error);
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo-container">
          <h1 className="brand-title">✨Career<span className="highlight">Crafter</span></h1>
        </div>

        <ul className="nav-links">
          <li onClick={() => navigate("/home")}>Home</li>
          <li onClick={() => navigate("/companies")}>Companies</li>
          <li onClick={() => navigate("/savedjobs")}>Saved Jobs</li>
          <li onClick={() => navigate("/submissions")}>Submissions</li>
          <li onClick={() => navigate("/select")}>Results</li>
        </ul>

        <div className="logout-avatar" onClick={handleLogout}>
          {user?.email?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </nav>

      {jobs.length > 0 ? (
        <div className="job-list">
          {jobs
            .filter(job => !notInterestedJobs.includes(job._id))
            .map(job => (
              <div key={job._id} className="job-card">
                <p>Posted: {job.postedTime ? new Date(job.postedTime).toLocaleString() : "N/A"}</p>
                <h3>{job.position} at {job.company}</h3>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Work Type:</strong> {job.workType}</p>
                <p><strong>Skills:</strong> {job.skills.length > 0 ? job.skills.join(", ") : "None"}</p>
                <p><strong>Education:</strong> {job.education}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Vacancies:</strong> {job.vacancies}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
                <p><strong>Expected Year:</strong> {job.expectedYear}</p>

                <div className="job-actions">
                  <button onClick={() => toggleSaveJob(job)}>
                    {isJobSaved(job) ? <FaBookmark className="saved" /> : <FaRegBookmark className="not-saved" />}
                  </button>
                  <button onClick={() => handleApplyClick(job)} disabled={job.isExpired}>
                    {job.isExpired ? "Application Closed" : "Apply"}
                  </button>
                  <button onClick={() => handleNotInterested(job._id)}>❌ Not Interested</button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="no-jobs">No jobs available.</p>
      )}

      {showLogoutModal && (
        <div className="logout-modal">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p><strong>Email:</strong> {user?.email || "N/A"}</p>
            {randomUser && <img src={randomUser.picture.medium} alt="User" />}
            <button onClick={confirmLogout}>Logout</button>
            <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
