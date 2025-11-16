// src/Home.js
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios.get(`${API_BASE}/me`)
      .then(res => {
        if (res.data && res.data.authenticated) {
          setUser(res.data.user || null);
          const role = res.data.role || localStorage.getItem("role");
          setIsAdmin(role === "admin");
          if (role) localStorage.setItem("role", role);
        } else {
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

  // Fetch jobs (from backend) and also merge local homePostedJobs if any
  useEffect(() => {
    let cancelled = false;
    axios.get(`${API_BASE}/jobs`)
      .then(res => {
        if (cancelled) return;
        const serverJobs = Array.isArray(res.data) ? res.data : [];
        // compute isExpired and normalize fields
        const normalized = serverJobs.map(j => ({
          ...j,
          isExpired: j.expiresAt ? (new Date() > new Date(j.expiresAt)) : false
        }));

        // also merge localStorage homePostedJobs (admin local copies) but avoid duplicates by _id or position+company
        const localJobs = JSON.parse(localStorage.getItem("homePostedJobs")) || [];
        const combined = [...normalized];

        localJobs.forEach(lj => {
          const exists = combined.some(sj => (sj._id && sj._id === lj._id) || (sj.position === lj.position && sj.company === lj.company));
          if (!exists) {
            // compute isExpired for local jobs too
            const isExpired = lj.expiresAt ? (new Date() > new Date(lj.expiresAt)) : false;
            combined.unshift({ ...lj, isExpired });
          }
        });

        setJobs(combined);
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
        // if network error, try load localStorage fallback
        const localJobs = JSON.parse(localStorage.getItem("homePostedJobs")) || [];
        const mapped = localJobs.map(lj => ({ ...lj, isExpired: lj.expiresAt ? (new Date() > new Date(lj.expiresAt)) : false }));
        setJobs(mapped);
      });

    return () => { cancelled = true; };
  }, []);

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

  const handleApplyClick = (job) => {
    if (job.isExpired) {
      alert("This application is no longer available (expired).");
      return;
    }
    // proceed to apply page
    navigate("/apply", { state: { job } });
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
              <div key={job._id || idx} className="job-card">
                <p>Posted: {job.postedTime ? new Date(job.postedTime).toLocaleString() : "N/A"}</p>
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

                  <button
                    className="apply-btn"
                    onClick={() => handleApplyClick(job)}
                    disabled={job.isExpired}
                  >
                    {job.isExpired ? "Application Closed" : "Apply"}
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
