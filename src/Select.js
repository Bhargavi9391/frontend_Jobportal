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

    if (!matchedJob) {
      return { 
        message: "❌ Job not found", 
        extra: "The job you applied for is no longer available or removed by the admin." 
      };
    }

    if (!application.skills || application.skills.length === 0) {
      return { 
        message: "❌ Unfit for this job", 
        extra: "No resume uploaded or no skills detected. Please upload your resume with relevant skills to be considered." 
      };
    }

    const normalize = str => (typeof str === "string" ? str.trim().toLowerCase() : "");
    const resumeSkills = application.skills.map(skill => normalize(skill));
    const missingSkills = (matchedJob.skills || []).filter(skill => !resumeSkills.includes(normalize(skill)));

    if (missingSkills.length === 0) {
      return { 
        message: "✅ Fit for this job 🎉", 
        extra: "Congratulations! You match all the required skills. Keep an eye on your email for further updates from the company." 
      };
    } else {
      return { 
        message: "❌ Unfit for this job", 
        missingSkills,
        extra: "Some required skills are missing in your resume. We recommend learning these skills and reapplying in the future." 
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

              {result.extra && (
                <p className="extra-message">{result.extra}</p>
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
