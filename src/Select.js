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

  const normalize = str => (typeof str === "string" ? str.trim().toLowerCase() : "");

  const getResultMessage = (application) => {
    const matchedJob = adminJobs.find(job =>
      normalize(job.position) === normalize(application.jobTitle) &&
      normalize(job.company) === normalize(application.company)
    );

    if (!matchedJob) return { message: "❌ Job not found" };

    const userSkills = (application.skills || []).map(skill => normalize(skill.name));

    const missingSkills = (matchedJob.skills || []).filter(
      skill => !userSkills.includes(normalize(skill))
    );

    if (missingSkills.length === 0) {
      return { message: "✅ Fit for this job 🎉" };
    } else {
      return { message: "❌ Unfit for this job", missingSkills };
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
            <div key={index} className={`result-card ${result.message.includes("Fit") ? "selected" : "unfit"}`}>
              <h3>{app.firstName} {app.lastName}</h3>
              <p><strong>Applied for:</strong> {app.jobTitle} at {app.company}</p>
              <p><strong>Status:</strong> {result.message}</p>
              {result.missingSkills && result.missingSkills.length > 0 && (
                <p><strong>Missing Skills:</strong> {result.missingSkills.join(", ")}</p>
              )}
              <FaTrashAlt className="back-icon2" onClick={() => handleDelete(index)} />
            </div>
          );
        })
      )}
    </div>
  );
}
