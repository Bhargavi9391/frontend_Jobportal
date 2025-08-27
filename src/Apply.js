import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Apply.css";

export default function Apply() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job || {};

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    graduationYear: "",
    cgpa: "",
    linkedIn: "",
    resume: "",
    location: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, [name]: files[0]?.name || "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let status = "Rejected";
    let reason = "";

    // ✅ Validation checks
    if (formData.graduationYear != job.expectedYear) {
      reason = "Graduation year mismatch";
    } else if (parseFloat(formData.cgpa) < 6.0) {
      reason = "CGPA below required cutoff";
    } else if (
      !formData.skills.toLowerCase().includes(job.skills[0]?.toLowerCase())
    ) {
      reason = "Required skill not found";
    } else if (
      formData.education &&
      job.education &&
      formData.education.toLowerCase() !== job.education.toLowerCase()
    ) {
      reason = "Education requirement not met";
    } else if (
      formData.location.toLowerCase() !== job.location.toLowerCase()
    ) {
      reason = "Location mismatch";
    } else {
      status = "Shortlisted";
    }

    const newApplication = {
      ...formData,
      jobTitle: job.position,
      company: job.company,
      education: job.education,
      status: status,
      reason: reason,
    };

    const storedApps = JSON.parse(localStorage.getItem("applications")) || [];
    storedApps.push(newApplication);
    localStorage.setItem("applications", JSON.stringify(storedApps));

    navigate("/select");
  };

  return (
    <div className="apply-container">
      <h2>Apply for {job.position} at {job.company}</h2>
      <form onSubmit={handleSubmit} className="apply-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name *"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name *"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="graduationYear"
          placeholder="Graduation Year *"
          value={formData.graduationYear}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.1"
          name="cgpa"
          placeholder="CGPA *"
          value={formData.cgpa}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="education"
          placeholder="Education *"
          value={formData.education}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="linkedIn"
          placeholder="LinkedIn Profile *"
          value={formData.linkedIn}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="resume"
          accept="application/pdf"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Current Location *"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="skills"
          placeholder="Enter Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

