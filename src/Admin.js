// src/Admin.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

export default function Admin() {
  const [jobData, setJobData] = useState({
    position: "", company: "", location: "", workType: "",
    expectedYear: "", description: "", vacancies: "", salary: "",
    skills: [], education: ""
  });
  const [submittedData, setSubmittedData] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);

  const navigate = useNavigate();
  const API_BASE = "https://jobportal-backend-xoym.onrender.com";

  // Load admin data
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/jobs`);
      setSubmittedData(res.data);
    } catch (err) {
      console.error(err);
      setSubmittedData([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobData.position || !jobData.company) return alert("Fill required fields");
    const jobPayload = { ...jobData, postedTime: new Date().toISOString() };

    try {
      if (editingJobId) await axios.put(`${API_BASE}/jobs/${editingJobId}`, jobPayload);
      else await axios.post(`${API_BASE}/jobs`, jobPayload);

      alert(editingJobId ? "Job updated!" : "Job posted!");
      setJobData({ position: "", company: "", location: "", workType: "", expectedYear: "", description: "", vacancies: "", salary: "", skills: [], education: "" });
      setEditingJobId(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleEdit = (job) => setJobData({ ...job, skills: job.skills || [] }) || setEditingJobId(job._id);
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure?")) return;
    await axios.delete(`${API_BASE}/jobs/${jobId}`);
    fetchJobs();
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    alert("👑 Admin logged out!");
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="admin-logout-btn" onClick={logoutAdmin}>Logout Admin</button>
      </div>

      <form onSubmit={handleSubmit} className="job-form">
        <select name="position" value={jobData.position} onChange={handleChange}>
          <option value="">Select Position</option>
          {["Software Engineer","Frontend Developer","Backend Developer"].map(pos => <option key={pos} value={pos}>{pos}</option>)}
        </select>
        <select name="company" value={jobData.company} onChange={handleChange}>
          <option value="">Select Company</option>
          {["Google","Amazon","Microsoft"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit">{editingJobId ? "Update Job" : "Post Job"}</button>
      </form>

      <div className="submitted-section">
        {submittedData.map(job => (
          <div key={job._id} className="job-card">
            <h3>{job.position} at {job.company}</h3>
            <div className="button-container">
              <button onClick={() => handleEdit(job)}>Edit</button>
              <button onClick={() => handleDelete(job._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
