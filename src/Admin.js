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
  const API_BASE = "https://backend-jobportal.onrender.com";


  // Load jobs from IndexedDB
  useEffect(() => {
    getJobsFromDB().then((data) => {
      setSubmittedData(data);
    });
  }, []);

  // Save jobs to IndexedDB on change
  useEffect(() => {
    if (submittedData.length > 0) {
      saveJobsToDB([...submittedData]);
    }
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
      alert("Please fill in required fields.");
      return;
    }

    let updatedData = [...submittedData];
    if (editingIndex !== null) {
      updatedData[editingIndex] = { ...jobData };
    } else {
      updatedData.push(jobData);
    }
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

 // Inside handlePostJob in Admin.js
const handlePostJob = async (job) => {
  const formattedJob = {
    ...job,
    postedTime: new Date().toISOString(),
    expectedYear: Number(job.expectedYear),
    vacancies: Number(job.vacancies || 0),
    skills: Array.isArray(job.skills)
      ? job.skills
      : typeof job.skills === "string"
      ? job.skills.split(",").map(s => s.trim()).filter(Boolean)
      : [],
  };

  try {
    await axios.post("https://jobportal-backend-xoym.onrender.com/jobs", formattedJob);
    alert("Job posted successfully!");

    // Save to localStorage for Select.js
    const storedJobs = JSON.parse(localStorage.getItem("homePostedJobs")) || [];
    storedJobs.push(formattedJob);
    localStorage.setItem("homePostedJobs", JSON.stringify(storedJobs));
  } catch (err) {
    console.error("Error posting job:", err.response?.data || err.message);
    alert("Error posting job: " + (err.response?.data?.message || err.message));
  }
};


  return (
    <div className="admin-container">
      <h2 className="form-title">Job Details Form</h2>

      {/* Job Form */}
      <form onSubmit={handleSubmit} className="job-form">
        {/* Position */}
        <div className="form-group">
          <label>Position:</label>
          <select name="position" value={jobData.position} onChange={handleChange} required>
            <option value="">Select Position</option>
            {Object.keys(jobDescriptions).map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div className="form-group">
          <label>Company:</label>
          <select name="company" value={jobData.company} onChange={handleChange} required>
            <option value="">Select Company</option>
            {["Google", "Amazon", "Microsoft", "Facebook", "Apple", "Netflix", "Tesla", "IBM", "Adobe", "Salesforce"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Expected Year */}
        <div className="form-group">
          <label>Expected Year of Joining:</label>
          <select name="expectedYear" value={jobData.expectedYear} onChange={handleChange} required>
            <option value="">Select Year</option>
            {Array.from({ length: 9 }, (_, i) => 2020 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Work Type */}
        <div className="form-group">
          <label>Work Type:</label>
          <select name="workType" value={jobData.workType} onChange={handleChange} required>
            <option value="">Select Work Type</option>
            {["Full-time", "Internship", "Fresher", "Remote", "Hybrid", "Work from Office"].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location:</label>
          <select name="location" value={jobData.location} onChange={handleChange} required>
            <option value="">Select Location</option>
            {[
              "Delhi, Delhi", "Pune, Maharashtra", "Kolkata, West Bengal",
              "Chandigarh, Punjab", "Ahmedabad, Gujarat", "Jaipur, Rajasthan",
              "Indore, Madhya Pradesh", "Coimbatore, Tamil Nadu", "Visakhapatnam, Andhra Pradesh",
              "Lucknow, Uttar Pradesh", "Bhubaneswar, Odisha", "Thiruvananthapuram, Kerala",
              "Nagpur, Maharashtra", "Mysore, Karnataka", "Surat, Gujarat"
            ].map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        {/* Skills */}
        <div className="form-group">
          <label>Skills:</label>
          <select onChange={handleSkillsChange}>
            <option value="">Select Skills</option>
            {["React.js", "Node.js", "MongoDB", "Express.js", "HTML", "CSS", "JavaScript", "Python", "Java", "C++"].map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <div className="selected-skills">
            {jobData.skills.map((skill, i) => (
              <span key={i} className="skill-tag">{skill}{i < jobData.skills.length - 1 ? ", " : ""}</span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="form-group">
          <label>Education:</label>
          <select name="education" value={jobData.education} onChange={handleChange} required>
            <option value="">Select Education</option>
            {["B.Tech", "M.Tech", "BCA", "MCA"].map(ed => <option key={ed} value={ed}>{ed}</option>)}
          </select>
        </div>

        {/* Salary */}
        <div className="form-group">
          <label>Salary:</label>
          <select name="salary" value={jobData.salary} onChange={handleChange} required>
            <option value="">Select Salary</option>
            {["10,000-50,000", "50,000-1,00,000", "1,00,000-1,50,000", "1,50,000-2,00,000", "2,00,000-3,00,000", "3,00,000-5,00,000", "5,00,000+"].map(s => <option key={s} value={s}>{s}</option>)}
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

        <button type="submit">{editingIndex !== null ? "Update Job" : "Submit Job"}</button>
      </form>

      {/* Job List */}
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
} and // src/Home.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notInterestedJobs, setNotInterestedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationCount, setApplicationCount] = useState(0);
  const [hasViewedResults, setHasViewedResults] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [randomUser, setRandomUser] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navigate = useNavigate();
  const API_BASE = "https://jobportal-backend-xoym.onrender.com";

  // Validate token and load user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // set axios header so requests include token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Validate token with /me endpoint
    axios.get(`${API_BASE}/me`)
      .then(res => {
        if (res.data && res.data.authenticated) {
          setUser(res.data.user || null);
          const role = res.data.role || localStorage.getItem("role");
          setIsAdmin(role === "admin");
          // ensure localStorage role is synced
          if (role) localStorage.setItem("role", role);
        } else {
          // not authenticated
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }
      })
      .catch(err => {
        console.error("Token validation failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      });

    const storedApplications = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(storedApplications);

    const storedSavedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(storedSavedJobs);

    const storedNotInterested = JSON.parse(localStorage.getItem("notInterestedJobs")) || [];
    setNotInterestedJobs(storedNotInterested);
  }, [navigate]);

  // Fetch jobs (after token is set)
  useEffect(() => {
    axios.get(`${API_BASE}/jobs`)
      .then(res => setJobs(res.data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  // Load application count and results viewed status
  useEffect(() => {
    const count = Number(localStorage.getItem("applicationCount")) || 0;
    const viewed = localStorage.getItem("hasViewedResults") === "true";
    setApplicationCount(count);
    setHasViewedResults(viewed);
  }, []);

  const handleNavigateToSelect = () => navigate("/select");

  const handleNotInterested = (jobId) => {
    const updated = [...notInterestedJobs, jobId];
    setNotInterestedJobs(updated);
    localStorage.setItem("notInterestedJobs", JSON.stringify(updated));
  };

  const toggleSaveJob = (job) => {
    let updatedSavedJobs = [...savedJobs];
    const jobIndex = savedJobs.findIndex(
      saved => saved.position === job.position && saved.company === job.company
    );

    if (jobIndex === -1) updatedSavedJobs.push(job);
    else updatedSavedJobs.splice(jobIndex, 1);

    setSavedJobs(updatedSavedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
  };

  const isJobSaved = (job) => savedJobs.some(
    saved => saved.position === job.position && saved.company === job.company
  );

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
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("savedJobs");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo-container">
          <h1 className="brand-title">✨Career<span className="highlight">Crafter</span></h1>
        </div>

        <div className="notification">
          {!hasViewedResults && <p className="application-count">{applicationCount}</p>}
        </div>

        <ul className="nav-links">
          <li onClick={() => navigate("/home")}>Home</li>
          <li onClick={() => navigate("/companies")}>Companies</li>
          <li onClick={() => navigate("/savedjobs")}>Saved Jobs</li>
          <li onClick={() => navigate("/submissions")}>Submissions</li>
          <li onClick={handleNavigateToSelect}>Results</li>
          <li className="more-link" onClick={() => setShowMoreMenu(!showMoreMenu)}>
            More
            {showMoreMenu && (
              <ul className="dropdown-menu">
                <li onClick={() => navigate("/more")}>Support</li>
              </ul>
            )}
          </li>
          <div className="email-icon-wrapper">
            <a href="mailto:owner@gmail.com?subject=Query" target="_blank" rel="noopener noreferrer">
              <span className="email-icon">📧</span>
            </a>
            <div className="tooltip2">If you have any queries, email the admin.</div>
          </div>
        </ul>

        <div className="logout-avatar" onClick={handleLogout}>
          {user?.email?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </nav>

      {jobs.length > 0 ? (
        <div className="job-list">
          {jobs
            .filter(job => !notInterestedJobs.includes(job._id))
            .map((job, idx) => (
              <div key={idx} className="job-card">
                <p>Posted: {new Date(job.postedTime).toLocaleString()}</p>
                <h3>{job.position} at {job.company}</h3>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Work Type:</strong> {job.workType}</p>
                <p><strong>Skills:</strong>
                  <ul>
                    {Array.isArray(job.skills) ? job.skills.map((skill, i) => <li key={i}>{skill}</li>) : <li>None</li>}
                  </ul>
                </p>
                <p><strong>Education:</strong> {job.education}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Vacancies:</strong> {job.vacancies}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
                <p><strong>Expected Year:</strong> {job.expectedYear}</p>

                <div className="job-actions">
                  <button className="save-btn" onClick={() => toggleSaveJob(job)}>
                    {isJobSaved(job) ? <FaBookmark className="saved" /> : <FaRegBookmark className="not-saved" />}
                  </button>
                  <button className="apply-btn" onClick={() => navigate("/apply", { state: { job } })}>
                    Apply
                  </button>
                  <button className="not-interested-btn" onClick={() => handleNotInterested(job._id)}>
                    ❌ Not Interested
                  </button>
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
            <button className="logout-btn" onClick={confirmLogout}>Logout</button>
            <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
