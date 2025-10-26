import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import './Select.css';

export default function Select() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [adminJobs, setAdminJobs] = useState([]);

  useEffect(() => {
    const storedApplications = JSON.parse(localStorage.getItem("applications")) || [];
    const storedAdminJobs = JSON.parse(localStorage.getItem("homePostedJobs")) || [];

    setApplications(storedApplications);
    setAdminJobs(storedAdminJobs);
  }, []);

  useEffect(() => {
    localStorage.setItem("hasViewedResults", "true");
  }, []);

  const getResultMessage = (application) => {
    const matchedJob = adminJobs.find(job =>
      job.position === application.jobTitle &&
      job.company === application.company
    );

    if (!matchedJob) return { message: "❌ Job not found" };

    // Normalize skill names to lowercase for comparison
    const normalize = str => (typeof str === "string" ? str.trim().toLowerCase() : "");

    const applicationSkills = application.skills || [];
    const manualSkills = application.manualSkills || [];

    // Combine slider skills + manual skills from user
    const userSkills = [
      ...applicationSkills.map(skill => normalize(skill.name)),
      ...manualSkills.map(skill => normalize(skill))
    ];

    // Check missing skills
    const missingSkills = (matchedJob.skills || []).filter(
      skill => !userSkills.includes(normalize(skill))
    );

    if (missingSkills.length === 0) {
      // All required skills are present → Fit
      return {
        message: "✅ Fit for this job 🎉"
      };
    } else {
      // Missing at least one skill → Unfit
      return {
        message: "❌ Unfit for this job",
        missingSkills
      };
    }
  };

  const handleDelete = (index) => {
    const updatedApplications = applications.filter((_, i) => i !== index);
    setApplications(updatedApplications);
    localStorage.setItem("applications", JSON.stringify(updatedApplications));
  };

  return (
    <div className="select-container">
      <FaArrowLeft className="back-icon" onClick={() => navigate("/home")} />
      <h2>Selection Results</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((app, index) => {
          const result = getResultMessage(app);
          return (
            <div
              key={index}
              className={`result-card ${result.message.includes("Fit") ? "selected" : "unfit"}`}
            >
              <h3>{app.firstName} {app.lastName}</h3>
              <p><strong>Applied for:</strong> {app.jobTitle} at {app.company}</p>
              <p><strong>Status:</strong> {result.message}</p>

              {result.missingSkills && result.missingSkills.length > 0 && (
                <p><strong>Missing Skills:</strong> {result.missingSkills.join(", ")}</p>
              )}

              <FaTrashAlt
                className="back-icon2"
                onClick={() => handleDelete(index)}
                aria-label="Delete Application"
              />
            </div>
          );
        })
      )}
    </div>
  );
}
