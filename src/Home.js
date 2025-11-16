import React, { useEffect, useState } from "react";
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
