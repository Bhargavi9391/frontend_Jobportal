// src/Home.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from "axios";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notInterestedJobs, setNotInterestedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationCount, setApplicationCount] = useState(0);
  const [hasViewedResults, setHasViewedResults] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navigate = useNavigate();
  const API_BASE = "https://jobportal-backend-xoym.onrender.com";

  // Load user data on mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "user") {
      navigate("/login");
      return;
    }

    setUser({ role, email: "User" }); // placeholder, can fetch actual user if needed
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Load saved jobs and applications from localStorage
    setSavedJobs(JSON.parse(localStorage.getItem("savedJobs")) || []);
    setNotInterestedJobs(JSON.parse(localStorage.getItem("notInterestedJobs")) || []);
    setApplications(JSON.parse(localStorage.getItem("applications")) || []);

    setApplicationCount(Number(localStorage.getItem("applicationCount")) || 0);
    setHasViewedResults(localStorage.getItem("hasViewedResults") === "true");
  }, [navigate]);

  // Fetch jobs
  useEffect(() => {
    axios.get(`${API_BASE}/jobs`)
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  // Save / remove jobs
  const toggleSaveJob = (job) => {
    const index = savedJobs.findIndex(
      saved => saved.position === job.position && saved.company === job.company
    );
    let updatedSaved = [...savedJobs];
    if (index === -1) updatedSaved.push(job);
    else updatedSaved.splice(index, 1);

    setSavedJobs(updatedSaved);
    localStorage.setItem("savedJobs", JSON.stringify(updatedSaved));
  };

  const handleNotInterested = (jobId) => {
    const updated = [...notInterestedJobs, jobId];
    setNotInterestedJobs(updated);
    localStorage.setItem("notInterestedJobs", JSON.stringify(updated));
  };

  // Navigate to Results
  const handleNavigateToSelect = () => navigate("/select");

  // User logout
  const logoutUser = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("savedJobs");
    localStorage.removeItem("applications");
    setUser(null);
    alert("✅ User logged out!");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1 className="brand-title">✨Career<span className="highlight">Crafter</span></h1>

        <ul className="nav-links">
          <li onClick={() => navigate("/home")}>Home</li>
          <li onClick={() => navigate("/companies")}>Companies</li>
          <li onClick={() => navigate("/savedjobs")}>Saved Jobs</li>
          <li onClick={() => navigate("/submissions")}>Submissions</li>
          <li onClick={handleNavigateToSelect}>Results</li>
          <li className="more-link" onClick={() => setShowMoreMenu(!showMoreMenu)}>
            More
            {showMoreMenu && <ul className="dropdown-menu"><li onClick={() => navigate("/more")}>Support</li></ul>}
          </li>
        </ul>

        <div className="logout-avatar" onClick={logoutUser}>
          {user?.email?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </nav>

      {jobs.length > 0 ? (
        <div className="job-list">
          {jobs.filter(job => !notInterestedJobs.includes(job._id)).map((job, idx) => (
            <div key={idx} className="job-card">
              <h3>{job.position} at {job.company}</h3>
              <p>Location: {job.location}</p>
              <p>Work Type: {job.workType}</p>
              <div className="job-actions">
                <button onClick={() => toggleSaveJob(job)}>
                  {savedJobs.some(saved => saved.position === job.position) ? <FaBookmark /> : <FaRegBookmark />}
                </button>
                <button onClick={() => navigate("/apply", { state: { job } })}>Apply</button>
                <button onClick={() => handleNotInterested(job._id)}>❌ Not Interested</button>
              </div>
            </div>
          ))}
        </div>
      ) : <p>No jobs available.</p>}
    </div>
  );
}
