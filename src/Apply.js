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
    location: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ simple logic: check once and decide status
    let status = "Rejected";

    if (
      formData.graduationYear == job.expectedYear &&
      parseFloat(formData.cgpa) >= 6.0 && // you can adjust cutoff
      formData.skills.toLowerCase().includes(job.skills[0].toLowerCase()) &&
      formData.location.toLowerCase() === job.location.toLowerCase() &&
      job.education.toLowerCase() === "m.tech"
    ) {
      status = "Shortlisted";
    }

    const newApplication = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      graduationYear: formData.graduationYear,
      cgpa: formData.cgpa,
      linkedIn: formData.linkedIn,
      location: formData.location,
      skills: formData.skills.split(",").map((s) => s.trim()),
      jobTitle: job.position,
      company: job.company,
      education: job.education,
      status: status, // ✅ save result
    };

    const existingApps = JSON.parse(localStorage.getItem("applications")) || [];
    existingApps.push(newApplication);
    localStorage.setItem("applications", JSON.stringify(existingApps));

    alert(`Application submitted! Status: ${status}`);
    navigate("/select");
  };

  return (
    <div className="apply-container">
      <h2>Apply for {job.position} at {job.company}</h2>
      <form onSubmit={handleSubmit} className="apply-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="graduationYear"
          placeholder="Graduation Year"
          value={formData.graduationYear}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.1"
          name="cgpa"
          placeholder="CGPA"
          value={formData.cgpa}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="linkedIn"
          placeholder="LinkedIn Profile URL"
          value={formData.linkedIn}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Current Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}
