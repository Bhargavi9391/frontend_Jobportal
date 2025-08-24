import React, { useEffect, useState } from "react";

const Select = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);

  useEffect(() => {
    const savedApplications = JSON.parse(localStorage.getItem("applications")) || [];
    const savedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    setApplications(savedApplications);
    setJobs(savedJobs);

    const matches = savedApplications.map((application) => {
      const normalize = (str) =>
        (str || "").toString().trim().toLowerCase();

      const matchedJob = savedJobs.find(
        (job) =>
          normalize(application.jobTitle) === normalize(job.position) && // ✅ fixed
          normalize(application.company) === normalize(job.company)
      );

      if (!matchedJob) {
        return { ...application, status: "❌ Job not found" };
      }

      // Graduation year check
      if (Number(application.graduationYear) !== Number(matchedJob.expectedYear)) {
        return { ...application, status: "❌ Year mismatch" };
      }

      // Education check
      if (normalize(application.education) !== normalize(matchedJob.education)) {
        return { ...application, status: "❌ Education mismatch" };
      }

      // Skills check
      if (application.skills?.some((skill) => matchedJob.skills?.includes(skill))) {
        return { ...application, status: "✅ Shortlisted" };
      }

      return { ...application, status: "❌ Skills mismatch" };
    });

    setShortlisted(matches);
  }, []);

  return (
    <div>
      <h2>Shortlisting Results</h2>
      <ul>
        {shortlisted.map((app, index) => (
          <li key={index}>
            {app.firstName} {app.lastName} → {app.jobTitle} at {app.company}  
            <b>{app.status}</b>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;

