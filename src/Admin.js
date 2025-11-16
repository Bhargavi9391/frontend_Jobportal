import { useState, useEffect } from "react";
import { saveJobsToDB, getJobsFromDB } from "./utils/indexedDB";
import axios from "axios";
import "./Admin.css";

export default function Admin() {
  const [jobData, setJobData] = useState({
    position: "",
    company: "",
    location: "",
    workType: "",
    expectedYear: "",
    description: "",
    vacancies: "",
    salary: "",
    postedTime: new Date(),
    skills: [],
    education: ""
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const API_BASE = "https://jobportal-backend-xoym.onrender.com";

  useEffect(() => {
    getJobsFromDB().then((data) => setSubmittedData(data));
  }, []);

  useEffect(() => {
    if (submittedData.length > 0) saveJobsToDB([...submittedData]);
  }, [submittedData]);

  const jobDescriptions = {
    "Software Engineer": "Designs, develops, and optimizes software applications...",
    "Frontend Developer": "Builds responsive, dynamic, and user-friendly interfaces...",
    "Backend Developer": "Handles business logic, databases, and API development...",
    "Full Stack Developer": "Combines frontend and backend development for web applications...",
    "DevOps Engineer": "Automates deployment and manages CI/CD pipelines...",
    "Data Scientist": "Analyzes data and builds prediction models...",
    "Machine Learning Engineer": "Develops and deploys ML algorithms...",
    "Cyber Security Analyst": "Protects applications and systems from threats...",
    "Cloud Engineer": "Designs and manages cloud infrastructure...",
    "UI/UX Designer": "Creates appealing and user-friendly designs..."
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
      description: name === "position" ? jobDescriptions[value] || "" : prev.description
    }));
  };

  const handleSkillsChange = (e) => {
    const skill = e.target.value;
    if (skill && !jobData.skills.includes(skill)) {
      setJobData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!jobData.position || !jobData.company) {
      alert("Please fill required fields");
      return;
    }

    let updated = [...submittedData];

    if (editingIndex !== null) updated[editingIndex] = { ...jobData };
    else updated.push(jobData);

    setSubmittedData(updated);

    setEditingIndex(null);
    setJobData({
      position: "",
      company: "",
      location: "",
      workType: "",
      expectedYear: "",
      description: "",
      vacancies: "",
      salary: "",
      skills: [],
      education: ""
    });
  };

  const handleDelete = (index) => {
    const updated = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updated);
  };

  const handleEdit = (index) => {
    setJobData({ ...submittedData[index] });
    setEditingIndex(index);
  };

  const handlePostJob = async (job) => {
    const formattedJob = {
      ...job,
      postedTime: new Date().toISOString(),
      expectedYear: Number(job.expectedYear),
      vacancies: Number(job.vacancies || 0),
      skills: Array.isArray(job.skills)
        ? job.skills
        : typeof job.skills === "string"
        ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : []
    };

    try {
      await axios.post(`${API_BASE}/jobs`, formattedJob);
      alert("Job posted successfully!");

      const stored = JSON.parse(localStorage.getItem("homePostedJobs")) || [];
      stored.push(formattedJob);
      localStorage.setItem("homePostedJobs", JSON.stringify(stored));
    } catch (err) {
      console.error("Error posting job:", err.response?.data || err.message);
      alert("Error posting job: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="admin-container">
      <h2 className="form-title">Job Details Form</h2>

      <form onSubmit={handleSubmit} className="job-form">
        
        <div className="form-group">
          <label>Position:</label>
          <select name="position" value={jobData.position} onChange={handleChange} required>
            <option value="">Select Position</option>
            {Object.keys(jobDescriptions).map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Company:</label>
          <select name="company" value={jobData.company} onChange={handleChange} required>
            <option value="">Select Company</option>
            {["Google","Amazon","Microsoft","Facebook","Apple","Netflix","Tesla","IBM","Adobe","Salesforce"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Expected Year of Joining:</label>
          <select name="expectedYear" value={jobData.expectedYear} onChange={handleChange} required>
            <option value="">Select Year</option>
            {Array.from({ length: 9 }, (_, i) => 2020 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Work Type:</label>
          <select name="workType" value={jobData.workType} onChange={handleChange} required>
            <option value="">Select Work Type</option>
            {["Full-time","Internship","Fresher","Remote","Hybrid","Work from Office"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Location:</label>
          <select name="location" value={jobData.location} onChange={handleChange} required>
            <option value="">Select Location</option>
            {[
              "Delhi, Delhi","Pune, Maharashtra","Kolkata, West Bengal","Chandigarh, Punjab",
              "Ahmedabad, Gujarat","Jaipur, Rajasthan","Indore, Madhya Pradesh","Coimbatore, Tamil Nadu",
              "Visakhapatnam, Andhra Pradesh","Lucknow, Uttar Pradesh","Bhubaneswar, Odisha",
              "Thiruvananthapuram, Kerala","Nagpur, Maharashtra","Mysore, Karnataka","Surat, Gujarat"
            ].map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Skills:</label>
          <select onChange={handleSkillsChange}>
            <option value="">Select Skills</option>
            {["React.js","Node.js","MongoDB","Express.js","HTML","CSS","JavaScript","Python","Java","C++"].map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <div className="selected-skills">
            {jobData.skills.map((skill, i) => (
              <span key={i} className="skill-tag">{skill}{i < jobData.skills.length - 1 ? ", " : ""}</span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Education:</label>
          <select name="education" value={jobData.education} onChange={handleChange} required>
            <option value="">Select Education</option>
            {["B.Tech","M.Tech","BCA","MCA"].map((ed) => (
              <option key={ed} value={ed}>{ed}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Salary:</label>
          <select name="salary" value={jobData.salary} onChange={handleChange} required>
            <option value="">Select Salary</option>
            {["10,000-50,000","50,000-1,00,000","1,00,000-1,50,000","1,50,000-2,00,000","2,00,000-3,00,000","3,00,000-5,00,000","5,00,000+"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={jobData.description} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Vacancies:</label>
          <input type="number" name="vacancies" value={jobData.vacancies} onChange={handleChange} required />
        </div>

        <button type="submit">{editingIndex !== null ? "Update Job" : "Submit Job"}</button>
      </form>

      <div className="submitted-section">
        {submittedData.length > 0 ? submittedData.map((job, idx) => (
          <div key={idx} className="job-card">
            <h3>{job.position} at {job.company}</h3>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Work Type:</strong> {job.workType}</p>
            <p><strong>Skills:</strong> {job.skills.join(", ")}</p>
            <p><strong>Education:</strong> {job.education}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Vacancies:</strong> {job.vacancies}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <p><strong>Expected Year of Joining:</strong> {job.expectedYear}</p>

            <div className="button-container">
              <button onClick={() => handleEdit(idx)}>Edit</button>
              <button onClick={() => handleDelete(idx)}>Delete</button>
              <button onClick={() => handlePostJob(job)}>Post</button>
            </div>
          </div>
        )) : <p>No jobs posted yet.</p>}
      </div>
    </div>
  );
}

