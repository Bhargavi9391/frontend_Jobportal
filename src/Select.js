import React, { useEffect, useState } from "react";

const normalize = (str) => (str ? str.toString().trim().toLowerCase() : "");

function Select() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const storedApplications = JSON.parse(localStorage.getItem("applications")) || [];
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    setApplications(storedApplications);
    setJobs(storedJobs);
  }, []);

  const getResultMessage = (application) => {
 const matchedJob = jobs.find(
  (job) =>
    normalize(application.jobTitle) === normalize(job.position) &&
    normalize(application.company) === normalize(job.company)
);



    if (!matchedJob) {
      return "❌ Job not found";
    }

    let reasons = [];
    let suggestions = [];

    // Graduation year check
    if (Number(application.graduationYear) !== Number(matchedJob.expectedYear)) {
      reasons.push(
        `Your graduation year (${application.graduationYear}) doesn't match the required year (${matchedJob.expectedYear}).`
      );
      suggestions.push("Apply to jobs matching your graduation timeline.");
    }

    // Education check
    if (normalize(application.education) !== normalize(matchedJob.education)) {
      reasons.push(
        `Your education (${application.education}) does not match the required education (${matchedJob.education}).`
      );
      suggestions.push(`This job requires ${matchedJob.education}.`);
    }

    // Skills check
    const missingSkills = matchedJob.skills.filter(
      (skill) => !application.skills.includes(skill)
    );
    if (missingSkills.length > 0) {
      reasons.push(`You are missing required skills: ${missingSkills.join(", ")}.`);
      suggestions.push(`Improve your skills in: ${missingSkills.join(", ")}.`);
    }

    // Final decision
    if (reasons.length === 0) {
      return "✅ Congratulations! You are shortlisted!";
    } else {
      return `❌ Not shortlisted.\nReasons:\n- ${reasons.join(
        "\n- "
      )}\nSuggestions:\n- ${suggestions.join("\n- ")}`;
    }
  };

  return (
    <div>
      <h2>Selection Results</h2>
      {applications.map((application, index) => (
        <div key={index} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <p>
            <strong>
              {application.firstName} {application.lastName}
            </strong>
          </p>
          <p>Applied for: {application.jobTitle} at {application.company}</p>
          <p>CGPA: {application.cgpa}</p>
          <p>Graduation Year: {application.graduationYear}</p>
          <p>Status: {getResultMessage(application)}</p>
        </div>
      ))}
    </div>
  );
}

export default Select;
