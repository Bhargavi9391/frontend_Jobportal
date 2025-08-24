import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import './Select.css';

export default function Select() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [adminJobs, setAdminJobs] = useState([]);

  // Load applications and admin jobs from localStorage
  useEffect(() => {
    const storedApplications = JSON.parse(localStorage.getItem("applications")) || [];
    const storedAdminJobs = JSON.parse(localStorage.getItem("homePostedJobs")) || [];
    setApplications(storedApplications);
    setAdminJobs(storedAdminJobs);
  }, []);

  // Mark results as viewed
  useEffect(() => {
    localStorage.setItem("hasViewedResults", "true");
  }, []);

  // Generate selection result for a single application
  const getResultMessage = (application) => {
    const matchedJob = adminJobs.find(job =>
      job.position === application.jobTitle &&
      job.company === application.company
    );

    if (!matchedJob) {
      return { message: "❌ Job not found", reasons: [], suggestions: [] };
    }

    const reasons = [];
    const suggestions = [];

    // Check CGPA
    if (Number(application.cgpa) < Number(matchedJob.cgpa || 0)) {
      reasons.push(`Your CGPA of ${application.cgpa} is below the required CGPA of ${matchedJob.cgpa}.`);
      suggestions.push("Consider improving your CGPA through additional courses.");
    }

    // Check graduation year
    const requiredYear = matchedJob.graduationYear || matchedJob.expectedYear || "Not Provided";
    if (application.graduationYear !== requiredYear) {
      reasons.push(`Your graduation year (${application.graduationYear}) doesn't match the required year (${requiredYear}).`);
      suggestions.push("Apply to roles that match your timeline.");
    }

    // Check skills
    const normalize = str => (typeof str === "string" ? str.trim().toLowerCase() : "");
    const applicationSkills = application.skills || [];
    const applicationSkillNames = applicationSkills.map(skill => normalize(skill.name));
    const missingSkills = (matchedJob.skills || []).filter(skill => !applicationSkillNames.includes(normalize(skill)));

    if (missingSkills.length > 0) {
      reasons.push(`Missing required skills: ${missingSkills.join(", ")}`);
      suggestions.push("Learn these skills via platforms like Udemy, Coursera, etc.");
    }

    if (reasons.length === 0) {
      return {
        message: "✅ You are selected! 🎉",
        followUp: "Details will be shared soon. Check your email regularly!",
        reasons: [],
        suggestions: []
      };
    } else {
      return {
        message: "❌ Unfit for this job",
        followUp: "Don’t be discouraged. Improve and try again!",
        reasons,
        suggestions
      };
    }
  };

  // Delete an application
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
          const isSelected = result.message.includes("selected");

          return (
            <div
              key={index}
              className={`result-card ${isSelected ? "selected" : "unfit"}`}
            >
              <h3>{app.firstName} {app.lastName}</h3>
              <p><strong>Applied for:</strong> {app.jobTitle} at {app.company}</p>
              <p><strong>CGPA:</strong> {app.cgpa || "Not Provided"}</p>
              <p><strong>Graduation Year:</strong> {app.graduationYear || "Not Provided"}</p>
              <p><strong>Status:</strong> {result.message}</p>
              {result.followUp && <p className="follow-up">{result.followUp}</p>}

              {result.reasons.length > 0 && (
                <>
                  <p><strong>Reasons:</strong></p>
                  <ul>
                    {result.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
                  </ul>
                </>
              )}

              {result.suggestions.length > 0 && (
                <>
                  <p><strong>Suggestions:</strong></p>
                  <ul>
                    {result.suggestions.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </>
              )}

              {!isSelected && (
                <small>
                  <p><strong>Extra Tips:</strong></p>
                  <ul className="extra-tips">
                    <li>Join open-source projects for experience.</li>
                    <li>Tailor your resume to each job.</li>
                    <li>Try internships or freelance work.</li>
                  </ul>
                </small>
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

