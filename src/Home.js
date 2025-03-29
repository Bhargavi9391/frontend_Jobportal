import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa"; 
import axios from "axios"; 
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [randomUser, setRandomUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const authenticatedUser = localStorage.getItem("authenticatedUser");
    if (authenticatedUser) {
      try {
        const parsedUser = JSON.parse(authenticatedUser);
        setUser(parsedUser);
        setIsAdmin(localStorage.getItem("isAdmin") === "true");
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("homePostedJobs")) || [];
    setPostedJobs(storedJobs);

    const storedSavedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(storedSavedJobs);
  }, []);


  const toggleSaveJob = (job) => {
    let updatedSavedJobs = [...savedJobs];
    const jobIndex = savedJobs.findIndex((saved) => saved.position === job.position && saved.company === job.company);

    if (jobIndex === -1) {
      updatedSavedJobs.push(job);
    } else {
      updatedSavedJobs.splice(jobIndex, 1);
    }

    setSavedJobs(updatedSavedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
  };

  const isJobSaved = (job) =>
    savedJobs.some((saved) => saved.position === job.position && saved.company === job.company);

  
  const handleLogout = async () => {
    try {
      const response = await axios.get("https://randomuser.me/api/");
      const userData = response.data.results[0];
      setRandomUser(userData); 

      setShowLogoutModal(true); 
    } catch (error) {
      console.error("Error fetching random user:", error);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("authenticatedUser");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("savedJobs");
    localStorage.removeItem("homePostedJobs");

    navigate("/");
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

        </ul>
        <h1 className="logout" onClick={handleLogout}>👤</h1>
      </nav>

      
      <h2 className="home-title">Available Jobs  ({postedJobs.length})</h2>
      {postedJobs.length > 0 ? (
        <div className="job-list">
          {postedJobs.map((job, index) => (
            <div key={index} className="job-card">
              <p>Posted {new Date(job.postedTime).toLocaleString()}</p>
              <h3>{job.position} at {job.company}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Work Type:</strong> {job.workType}</p>
              <p><strong>Skills:</strong> {Array.isArray(job.skills) ? job.skills.join(", ") : job.skills}</p>
              <p><strong>Education:</strong> {job.education}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Vacancies:</strong> {job.vacancies}</p>
              <p><strong>Salary:</strong> {job.salary}</p>

            
              <div className="job-actions">
                <button className="save-btn" onClick={() => toggleSaveJob(job)}>
                  {isJobSaved(job) ? <FaBookmark className="saved" /> : <FaRegBookmark className="not-saved" />}
                </button>
                <button 
                  className="apply-btn" 
                  onClick={() => navigate("/apply", { state: { job } })}
                >
                  Apply
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
            <p><strong>Email:</strong> {user?.email || "Not Available"}</p>

            
            {randomUser && (
              <div className="random-user">
                <img src={randomUser.picture.medium} alt="Random User" />
              </div>
            )}

            <button className="logout-btn" onClick={confirmLogout}>Logout</button>
            <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
