import React, { useEffect, useState } from "react";
import "./Select.css";

export default function Select() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const storedApps = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(storedApps);
  }, []);

  return (
    <div className="select-container">
      <h2>Application Results</h2>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        applications.map((app, index) => (
          <div key={index} className="result-card">
            <h3>
              {app.firstName} {app.lastName}
            </h3>
            <p>
              <strong>Applied for:</strong> {app.jobTitle} at {app.company}
            </p>
            <p>
              <strong>Graduation Year:</strong> {app.graduationYear}
            </p>
            <p>
              <strong>Education:</strong> {app.education}
            </p>
            <p>
              <strong>CGPA:</strong> {app.cgpa}
            </p>
            <p>
              <strong>Skills:</strong> {app.skills.join(", ")}
            </p>
            <p>
              <strong>Location:</strong> {app.location}
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a href={app.linkedIn} target="_blank" rel="noreferrer">
                View Profile
              </a>
            </p>

            {/* ✅ Status & Reason */}
            {app.status === "Shortlisted" ? (
              <h4 style={{ color: "green" }}>✅ Shortlisted</h4>
            ) : (
              <div>
                <h4 style={{ color: "red" }}>❌ Rejected</h4>
                <p style={{ color: "gray" }}>
                  <strong>Reason:</strong> {app.reason}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
