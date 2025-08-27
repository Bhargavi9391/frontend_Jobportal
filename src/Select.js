import { useEffect, useState } from "react";

export default function Select() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const storedApps = JSON.parse(localStorage.getItem("applications")) || [];
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    setApplications(storedApps);
    setJobs(storedJobs);
  }, []);

  const normalize = (str) =>
    typeof str === "string" ? str.trim().toLowerCase() : "";

  const getResultMessage = (application) => {
    const matchedJob = jobs.find(
      (job) => normalize(job.position) === normalize(application.position)
    );

    if (!matchedJob) {
      return {
        message: "❌ No matching job found for this application.",
        reasons: ["Job not found."],
        suggestions: ["Apply to an available job."],
      };
    }

    const reasons = [];
    const suggestions = [];

    // ✅ SKILLS CHECK (fix for [object Object])
    const userSkills = (application.skills || [])
      .map((s) =>
        typeof s === "string" ? normalize(s) : normalize(s.name)
      )
      .filter(Boolean);

    const requiredSkills = (matchedJob.skills || [])
      .map((s) => normalize(s))
      .filter(Boolean);

    const hasAllSkills = requiredSkills.every((skill) =>
      userSkills.includes(skill)
    );

    if (!hasAllSkills) {
      const missing = requiredSkills.filter(
        (skill) => !userSkills.includes(skill)
      );
      reasons.push(`Missing required skills: ${missing.join(", ")}`);
      suggestions.push("Improve these skills before applying again.");
    }

    // ✅ FINAL DECISION
    if (reasons.length === 0) {
      return {
        message: "✅ Shortlisted: You are fit for this job 🎉",
        reasons: [],
        suggestions: [],
      };
    } else {
      return {
        message: "❌ Unfit for this job",
        reasons,
        suggestions,
      };
    }
  };

  const handleSelect = (app) => {
    setSelectedApp(app);
    const res = getResultMessage(app);
    setResult(res);
  };

  return (
    <div className="select-container">
      <h2>Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul>
          {applications.map((app, idx) => (
            <li key={idx}>
              <strong>{app.name}</strong> - {app.position}
              <button onClick={() => handleSelect(app)}>Check</button>
            </li>
          ))}
        </ul>
      )}

      {selectedApp && result && (
        <div className="result-card">
          <h3>Result for {selectedApp.name}</h3>
          <p>{result.message}</p>

          {result.reasons.length > 0 && (
            <>
              <h4>Reasons:</h4>
              <ul>
                {result.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}

          {result.suggestions.length > 0 && (
            <>
              <h4>Suggestions:</h4>
              <ul>
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
