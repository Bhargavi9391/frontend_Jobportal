import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "./Apply.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function Apply() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job || {};

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    graduationYear: "",
    cgpa: "",
    linkedin: "",
    location: "",
    resumeFile: null, // store file object
    extractedSkills: [], // skills extracted from PDF
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF.");
      return;
    }

    setFormData(prev => ({ ...prev, resumeFile: file }));

    // Extract text from PDF
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let textContent = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        text.items.forEach(item => textContent += item.str + " ");
      }

      // Convert text to lowercase and split into words
      const textWords = textContent.toLowerCase().split(/[\s,]+/);

      // Check which skills from admin job exist in resume
      const skillsInJob = job.skills || [];
      const matchedSkills = skillsInJob.filter(skill =>
        textWords.includes(skill.toLowerCase())
      );

      setFormData(prev => ({ ...prev, extractedSkills: matchedSkills }));
    };
    fileReader.readAsArrayBuffer(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.resumeFile) {
      alert("Please upload your resume.");
      return;
    }

    // Save application to localStorage
    const newApplication = {
      jobTitle: job.position,
      company: job.company,
      firstName: formData.firstName,
      lastName: formData.lastName,
      graduationYear: formData.graduationYear,
      cgpa: formData.cgpa,
      linkedin: formData.linkedin,
      location: formData.location,
      resumeFileName: formData.resumeFile.name,
      skills: formData.extractedSkills, // skills from resume
    };

    const existingApplications = JSON.parse(localStorage.getItem("applications")) || [];
    localStorage.setItem("applications", JSON.stringify([...existingApplications, newApplication]));
    alert("Application submitted successfully!");
    navigate("/submissions");
  };

  return (
    <div className="apply-container">
      <h2>Apply for {job.position} at {job.company}</h2>
      <form onSubmit={handleSubmit} className="apply-form">
        <label>First Name *</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

        <label>Last Name *</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

        <label>Graduation Year *</label>
        <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required />

        <label>CGPA *</label>
        <input type="text" name="cgpa" value={formData.cgpa} onChange={handleChange} required />

        <label>LinkedIn Profile *</label>
        <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} required />

        <label>Upload Resume (PDF) *</label>
        <input type="file" accept=".pdf" onChange={handleFileChange} required />

        <label>Current Location *</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required />

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}
