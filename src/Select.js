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

    if (!matchedJob) return { message: "❌ Job not found", reasons: [], suggestions: [] };

    const reasons = [];
    const suggestions = [];

    // ✅ Check CGPA
    if (Number(application.cgpa) < Number(matchedJob.cgpa)) {
      reasons.push(`Your CGPA of ${application.cgpa} is below the required CGPA of ${matchedJob.cgpa}.`);
      suggestions.push("Consider improving your CGPA through additional courses.");
    }

    // ✅ Check Graduation Year
    const requiredYear = matchedJob.graduationYear || matchedJob.expectedYear || "Not Provided";
    if (application.graduationYear !== requiredYear) {
      reasons.push(`Your graduation year (${application.graduationYear}) doesn't match the required year (${requiredYear}).`);
      suggestions.push("Apply to roles that match your timeline.");
    }

    // ✅ Skills Matching
    const normalize = str => (typeof str === "string" ? str.trim().toLowerCase() : "");

    const applicationSkills = application.skills || [];
    const applicationSkillNames = applicationSkills.map(skill => normalize(skill.name));

    const requiredSkills = (matchedJob.skills || []).map(skill => normalize(skill));

    const hasAllRequiredSkills = requiredSkills.every(skill =>
      applicationSkillNames.includes(skill)
    );

    if (!hasAllRequiredSkills) {
      const missingSkills = requiredSkills.filter(skill => !applicationSkillNames.includes(skill));
      reasons.push(`Missing required skills: ${missingSkills.join(", ")}`);
      suggestions.push("Learn these skills via platforms like Udemy, Coursera, etc.");
    }

    // ✅ Final Result
    if (reasons.length === 0) {
      return {
        message: "✅ Shortlisted: You are fit for this job 🎉",
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
              className={`result-card ${result.message.includes("Shortlisted") ? "selected" : "unfit"}`}
            >
              <h3>{app.firstName} {app.lastName}</h3>
              <p><strong>Applied for:</strong> {app.jobTitle} at {app.company}</p>
              <p><strong>CGPA:</strong> {app.cgpa || "Not Provided"}</p>
              <p><strong>Graduation Year:</strong> {app.graduationYear || "Not Provided"}</p>
              <p><strong>Status:</strong> {result.message}</p>
              {result.followUp && (
                <p className="follow-up">{result.followUp}</p>
              )}

              {result.reasons.length > 0 && (
                <>
                  <p><strong>Reasons:</strong></p>
                  <ul>
                    {result.reasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </>
              )}

              {result.suggestions.length > 0 && (
                <>
                  <p><strong>Suggestions:</strong></p>
                  <ul>
                    {result.suggestions.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </>
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
