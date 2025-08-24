import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; 
import "./SavedJobs.css";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  // Load saved jobs from localStorage
  useEffect(() => {
    const storedSavedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(storedSavedJobs);
  }, []);

  // Remove a job from saved list
  const removeJob = (jobToRemove) => {
    const updatedJobs = savedJobs.filter(
      (job) => job.position !== jobToRemove.position || job.company !== jobToRemove.company
    );
    setSavedJobs(updatedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
  };

  return (
    <div className="saved-jobs-container">
      <h2 className="title">Saved Jobs</h2>

      {savedJobs.length > 0 ? (
        <div className="job-list">
          {savedJobs.map((job, index) => (
            <div key={index} className="job-card">
              <h3>{job.position} at {job.company}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Work Type:</strong> {job.workType}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <button className="remove-btn" onClick={() => removeJob(job)}>
                <FaTrash /> Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-jobs">No saved jobs.</p>
      )}

      <button className="back-btn" onClick={() => navigate("/home")}>
        Back to Home
      </button>
    </div>
  );
}
