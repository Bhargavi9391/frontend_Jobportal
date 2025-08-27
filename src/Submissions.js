import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Submissions.css";

export default function Submissions() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(stored);
  }, []);

  if (applications.length === 0) {
    return (
      <div className="submissions-container">
        <h2>No Applications Found</h2>
        <button onClick={() => navigate("/")}>Back to Jobs</button>
      </div>
    );
  }

  return (
    <div className="submissions-container">
      <h2>Your Applications</h2>
      <div className="applications-list">
        {applications.map((app, index) => (
          <div key={index} className="application-card">
            <h3>{app.position} at {app.company}</h3>
            <p><strong>Applied on:</strong> {new Date(app.appliedAt).toLocaleString()}</p>
            <p><strong>Name:</strong> {app.firstName} {app.lastName}</p>
            <p><strong>Graduation Year:</strong> {app.graduationYear}</p>
            <p><strong>CGPA:</strong> {app.cgpa}</p>
            <p><strong>LinkedIn:</strong> <a href={app.linkedin} target="_blank" rel="noreferrer">{app.linkedin}</a></p>
            <p><strong>Location:</strong> {app.location}</p>
            <p><strong>Resume:</strong> {app.resume}</p>

            {/* ✅ Fix for skills */}
            <p>
              <strong>Skills:</strong>{" "}
              {Array.isArray(app.skills)
                ? app.skills.map(s => (typeof s === "string" ? s : s.name)).join(", ")
                : (app.skills || "N/A")}
            </p>

            {/* ✅ Fix for manual skills */}
            <p>
              <strong>Manual Skills:</strong>{" "}
              {Array.isArray(app.manualSkills)
                ? app.manualSkills.join(", ")
                : (app.manualSkills || "N/A")}
            </p>

            {/* ✅ Fix for required skills */}
            <p>
              <strong>Required Skills:</strong>{" "}
              {Array.isArray(app.requiredSkills)
                ? app.requiredSkills.join(", ")
                : (app.requiredSkills || "N/A")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
