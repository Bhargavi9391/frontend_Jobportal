// src/pages/Select.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import "./Select.css";

export default function Select() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [adminJobs, setAdminJobs] = useState([]);

  useEffect(() => {
    // Load applications from localStorage
    const storedApplications =
      JSON.parse(localStorage.getItem("applications")) || [];
    const storedAdminJobs =
      JSON.parse(localStorage.getItem("homePostedJobs")) || [];

    setApplications(storedApplications);
    setAdminJobs(storedAdminJobs);
  }, []);

  useEffect(() => {
    // Mark results page as viewed
    localStorage.setItem("hasViewedResults", "true");
  }, []);

  // Normalize function (to ignore case & spaces)
  const normalize = (str) => (str || "").trim().toLowerCase();

  // Function to check result
  const getResultMessage = (application) => {
    const matchedJob = adminJobs.find(
      (job) =>
      normalize(job.position).includes(normalize(application.jobTitle)) &&
      normalize(job.company).includes(normalize(application.company))

    );

    if (!matchedJob) {
      return { message: "❌ Job not found", reasons: [], suggestions: [] };
    }

    const reasons = [];
    const suggestions = [];

    // Check CGPA
    if (Number(application.cgpa) < Number(matchedJob.cgpa)) {
      reasons.push(
        `Your CGPA of ${application.cgpa} is below the required CGPA of ${matchedJob.cgpa}.`
      );
      suggestions.push("Consider improving your CGPA through extra learning.");
    }

    // Check Graduation Year
    const requiredYear =
      matchedJob.graduationYear || matchedJob.expectedYear || "Not Provided";

   if (Number(application.graduationYear) !== Number(requiredYear))
 {
      reasons.push(
        `Your graduation year (${application.graduationYear}) doesn't match the required year (${requiredYear}).`
      );
      suggestions.push("Apply to jobs matching your graduation timeline.");
    }

    // Check Skills
    const applicationSkills = application.skills || [];
   const missingSkills = (matchedJob.skills || []).filter(
  (skill) =>
    !applicationSkills.some((s) => normalize(s).includes(normalize(skill)))
);


    if (missingSkills.length > 0) {
      reasons.push(`Missing required skills: ${missingSkills.join(", ")}`);
      suggestions.push(
        "Learn these skills via Udemy, Coursera, or open-source projects."
      );
    }

    // Final Result
    if (reasons.length === 0) {
      return {
        message: "✅ You are selected! 🎉",
        followUp:
          "Details will be shared soon. Please check your email regularly.",
        reasons: [],
        suggestions: [],
      };
    } else {
      return {
        message: "❌ Unfit for this job",
        followUp: "Don’t be discouraged. Improve and apply again!",
        reasons,
        suggestions,
      };
    }
  };

  // Delete application
  const handleDelete = (index) => {
    const updatedApplications = applications.filter((_, i) => i !== index);
    setApplications(updatedApplications);
    localStorage.setItem("applications", JSON.stringify(updatedApplications));
  };

  return (
    <div className="select-container">
      {/* Back to home button */}
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
             className={`result-card ${result.message.startsWith("✅") ? "selected" : "unfit"}`}

            >
              <h3>
                {app.firstName} {app.lastName}
              </h3>
              <p>
                <strong>Applied for:</strong> {app.jobTitle} at {app.company}
              </p>
              <p>
                <strong>CGPA:</strong> {app.cgpa || "Not Provided"}
              </p>
              <p>
                <strong>Graduation Year:</strong>{" "}
                {app.graduationYear || "Not Provided"}
              </p>
              <p>
                <strong>Status:</strong> {result.message}
              </p>

              {result.followUp && (
                <p className="follow-up">{result.followUp}</p>
              )}

              {/* Reasons */}
              {result.reasons.length > 0 && (
                <>
                  <p>
                    <strong>Reasons:</strong>
                  </p>
                  <ul>
                    {result.reasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <>
                  <p>
                    <strong>Suggestions:</strong>
                  </p>
                  <ul>
                    {result.suggestions.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* Extra Tips for Unfit */}
              {result.message.includes("Unfit") && (
                <small>
                  <p>
                    <strong>Extra Tips:</strong>
                  </p>
                  <ul className="extra-tips">
                    <li>Join open-source projects for experience.</li>
                    <li>Tailor your resume to each job.</li>
                    <li>Try internships or freelance work.</li>
                  </ul>
                </small>
              )}

              {/* Delete button */}
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
