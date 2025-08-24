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

  // Load jobs from IndexedDB
  useEffect(() => {
    getJobsFromDB().then((data) => {
      setSubmittedData(data);
    });
  }, []);

  // Save jobs to IndexedDB on change
  useEffect(() => {
    if (submittedData.length > 0) {
      saveJobsToDB([...submittedData]);
    }
  }, [submittedData]);

  const jobDescriptions = {
    "Software Engineer": "Designs, develops, and optimizes software applications...",
    "Frontend Developer": "Builds responsive, dynamic, and user-friendly interfaces...",
    "Backend Developer": "Handles business logic, databases, and API development...",
    "Full Stack Developer": "Combines frontend and backend development to create complete web applications...",
    "DevOps Engineer": "Automates development, testing, and deployment pipelines...",
    "Data Scientist": "Processes and analyzes large datasets to extract meaningful insights...",
    "Machine Learning Engineer": "Builds, trains, and deploys machine learning models...",
    "Cyber Security Analyst": "Protects systems, networks, and data from security threats...",
    "Cloud Engineer": "Designs and manages cloud-based solutions...",
    "UI/UX Designer": "Creates visually appealing and user-friendly digital experiences..."
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
    const selectedSkill = e.target.value;
    if (selectedSkill && !jobData.skills.includes(selectedSkill)) {
      setJobData((prev) => ({ ...prev, skills: [...prev.skills, selectedSkill] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobData.position || !jobData.company) {
      alert("Please fill in required fields.");
      return;
    }

    let updatedData = [...submittedData];
    if (editingIndex !== null) {
      updatedData[editingIndex] = { ...jobData };
    } else {
      updatedData.push(jobData);
    }
    setSubmittedData(updatedData);

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
    const updatedJobs = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedJobs);
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
        ? job.skills.split(",").map(s => s.trim()).filter(Boolean)
        : [],
    };

    try {
      await axios.post("https://jobportal-backend-xoym.onrender.com/jobs", formattedJob);
      alert("Job posted successfully!");
    } catch (err) {
      console.error("Error posting job:", err.response?.data || err.message);
      alert("Error posting job: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="admin-container">
      <h2 className="form-title">Job Details Form</h2>

      {/* Job Form */}
      <form onSubmit={handleSubmit} className="job-form">
        {/* Position */}
        <div className="form-group">
          <label>Position:</label>
          <select name="position" value={jobData.position} onChange={handleChange} required>
            <option value="">Select Position</option>
            {Object.keys(jobDescriptions).map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div className="form-group">
          <label>Company:</label>
          <select name="company" value={jobData.company} onChange={handleChange} required>
            <option value="">Select Company</option>
            {["Google", "Amazon", "Microsoft", "Facebook", "Apple", "Netflix", "Tesla", "IBM", "Adobe", "Salesforce"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Expected Year */}
        <div className="form-group">
          <label>Expected Year of Joining:</label>
          <select name="expectedYear" value={jobData.expectedYear} onChange={handleChange} required>
            <option value="">Select Year</option>
            {Array.from({ length: 9 }, (_, i) => 2020 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Work Type */}
        <div className="form-group">
          <label>Work Type:</label>
          <select name="workType" value={jobData.workType} onChange={handleChange} required>
            <option value="">Select Work Type</option>
            {["Full-time", "Internship", "Fresher", "Remote", "Hybrid", "Work from Office"].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location:</label>
          <select name="location" value={jobData.location} onChange={handleChange} required>
            <option value="">Select Location</option>
            {[
              "Delhi, Delhi", "Pune, Maharashtra", "Kolkata, West Bengal",
              "Chandigarh, Punjab", "Ahmedabad, Gujarat", "Jaipur, Rajasthan",
              "Indore, Madhya Pradesh", "Coimbatore, Tamil Nadu", "Visakhapatnam, Andhra Pradesh",
              "Lucknow, Uttar Pradesh", "Bhubaneswar, Odisha", "Thiruvananthapuram, Kerala",
              "Nagpur, Maharashtra", "Mysore, Karnataka", "Surat, Gujarat"
            ].map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        {/* Skills */}
        <div className="form-group">
          <label>Skills:</label>
          <select onChange={handleSkillsChange}>
            <option value="">Select Skills</option>
            {["React.js", "Node.js", "MongoDB", "Express.js", "HTML", "CSS", "JavaScript", "Python", "Java", "C++"].map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <div className="selected-skills">
            {jobData.skills.map((skill, i) => (
              <span key={i} className="skill-tag">{skill}{i < jobData.skills.length - 1 ? ", " : ""}</span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="form-group">
          <label>Education:</label>
          <select name="education" value={jobData.education} onChange={handleChange} required>
            <option value="">Select Education</option>
            {["B.Tech", "M.Tech", "BCA", "MCA"].map(ed => <option key={ed} value={ed}>{ed}</option>)}
          </select>
        </div>

        {/* Salary */}
        <div className="form-group">
          <label>Salary:</label>
          <select name="salary" value={jobData.salary} onChange={handleChange} required>
            <option value="">Select Salary</option>
            {["10,000-50,000", "50,000-1,00,000", "1,00,000-1,50,000", "1,50,000-2,00,000", "2,00,000-3,00,000", "3,00,000-5,00,000", "5,00,000+"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={jobData.description} onChange={handleChange} required />
        </div>

        {/* Vacancies */}
        <div className="form-group">
          <label>Vacancies:</label>
          <input type="number" name="vacancies" value={jobData.vacancies} onChange={handleChange} required />
        </div>

        <button type="submit">{editingIndex !== null ? "Update Job" : "Submit Job"}</button>
      </form>

      {/* Job List */}
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
