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

  useEffect(() => {
    getJobsFromDB().then((data) => setSubmittedData(data));
  }, []);

  useEffect(() => {
    saveJobsToDB([...submittedData]);
  }, [submittedData]);

  const jobDescriptions = {
    "Software Engineer": "Designs, develops, and optimizes software applications...",
    "Frontend Developer": "Builds responsive, dynamic, and user-friendly interfaces...",
    "Backend Developer": "Handles business logic, databases, and API development...",
    "Full Stack Developer": "Combines frontend and backend development...",
    "DevOps Engineer": "Automates development, testing, and deployment pipelines...",
    "Data Scientist": "Processes and analyzes large datasets...",
    "Machine Learning Engineer": "Builds, trains, and deploys ML models...",
    "Cyber Security Analyst": "Protects systems, networks, and data...",
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

    const updatedData = [...submittedData];
    if (editingIndex !== null) {
      updatedData[editingIndex] = { ...jobData };
    } else {
      updatedData.push(jobData);
    }

    setSubmittedData(updatedData);
    setEditingIndex(null);

    handlePostJob(jobData);

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
    setSubmittedData(submittedData.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setJobData({ ...submittedData[index] });
    setEditingIndex(index);
  };

  const handlePostJob = async (job) => {
    const formattedJobData = {
      ...job,
      postedTime: new Date().toISOString(),
      expectedYear: Number(job.expectedYear),
      vacancies: Number(job.vacancies || 0),
      skills: Array.isArray(job.skills)
        ? job.skills
        : typeof job.skills === "string"
          ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
    };

    try {
      await axios.post(
        "https://jobportal-backend-xoym.onrender.com/jobs",
        formattedJobData
      );
      alert("Job posted successfully!");
    } catch (err) {
      console.error("Error posting job:", err.response?.data || err.message);
      alert("Error posting job: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="admin-container">
      <h2 className="form-title">Job Details Form</h2>
      <form onSubmit={handleSubmit} className="job-form">
        {/* Position */}
        <div className="form-group">
          <label>Position:</label>
          <select name="position" value={jobData.position} onChange={handleChange} required>
            <option value="">Select Position</option>
            {Object.keys(jobDescriptions).map((position) => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div className="form-group">
          <label>Company:</label>
          <select name="company" value={jobData.company} onChange={handleChange} required>
            <option value="">Select Company</option>
            {["Google", "Amazon", "Microsoft", "Facebook", "Apple", "Netflix", "Tesla", "IBM", "Adobe", "Salesforce"].map((company) => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>

        {/* Expected Year */}
        <div className="form-group">
          <label>Expected Year of Joining:</label>
          <select name="expectedYear" value={jobData.expectedYear} onChange={handleChange} required>
            <option value="">Select Year</option>
            {Array.from({ length: 9 }, (_, i) => 2020 + i).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Work Type */}
        <div className="form-group">
          <label>Work Type:</label>
          <select name="workType" value={jobData.workType} onChange={handleChange} required>
            <option value="">Select Work Type</option>
            {["Full-time", "Internship", "Fresher", "Remote", "Hybrid", "Work from Office"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location:</label>
          <select name="location" value={jobData.location} onChange={handleChange} required>
            <option value="">Select Location</option>
            {["Delhi", "Pune", "Kolkata", "Chandigarh", "Ahmedabad", "Jaipur", "Indore", "Coimbatore", "Visakhapatnam", "Lucknow", "Bhubaneswar", "Thiruvananthapuram", "Nagpur", "Mysore", "Surat"].map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Skills */}
        <div className="form-group">
          <label>Skills:</label>
          <select onChange={handleSkillsChange}>
            <option value="">Select Skills</option>
            {["React.js", "Node.js", "MongoDB", "Express.js", "HTML", "CSS", "JavaScript", "Python", "Java", "C++"].map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <div className="selected-skills">
            {jobData.skills.join(", ")}
          </div>
        </div>

        {/* Education */}
        <div className="form-group">
          <label>Education:</label>
          <select name="education" value={jobData.education} onChange={handleChange} required>
            <option value="">Select Education</option>
            {["B.Tech", "M.Tech", "BCA", "MCA"].map((ed) => (
              <option key={ed} value={ed}>{ed}</option>
            ))}
          </select>
        </div>

        {/* Salary */}
        <div className="form-group">
          <label>Salary:</label>
          <select name="salary" value={jobData.salary} onChange={handleChange} required>
            <option value="">Select Salary</option>
            {["10,000-50,000", "50,000-1,00,000", "1,00,000-1,50,000", "1,50,000-2,00,000", "2,00,000-3,00,000", "3,00,000-5,00,000", "5,00,000+"].map((sal) => (
              <option key={sal} value={sal}>{sal}</option>
            ))}
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

      <div className="submitted-section">
        {submittedData.length > 0 ? (
          submittedData.map((job, index) => (
            <div key={index} className="job-card">
              <h3>{job.position} at {job.company}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Work Type:</strong> {job.workType}</p>
              <p><strong>Skills:</strong> {job.skills.join(", ")}</p>
              <p><strong>Education:</strong> {job.education}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Vacancies:</strong> {job.vacancies}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Expected Year:</strong> {job.expectedYear}</p>
              <div>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
                <button onClick={() => handlePostJob(job)}>Post</button>
              </div>
            </div>
          ))
        ) : (
          <p>No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
}

