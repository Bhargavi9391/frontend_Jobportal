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
    linkedin: "",
    resume: null,
    location: "",
  });

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, resume: reader.result })); // ✅ Save Base64 string
      };
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    
    const existingApplications = JSON.parse(localStorage.getItem("applications")) || [];
  
    
    const newApplication = {
      jobTitle: job.position,
      company: job.company,
      firstName: formData.firstName,
      lastName: formData.lastName,
      graduationYear: formData.graduationYear,
      cgpa: formData.cgpa,
      linkedin: formData.linkedin,
      location: formData.location,
      resume: formData.resume, 
    };
  
   
    const updatedApplications = [...existingApplications, newApplication];
    localStorage.setItem("applications", JSON.stringify(updatedApplications));
  
    alert("Data is Submitted!");
    navigate("/submissions"); 
  };
  

  return (
    <div className="apply-container">
      <h2>Apply for {job.position} at {job.company}</h2>
      <form className="apply-form" onSubmit={handleSubmit}>
        
        
        <label>First Name *</label>
        <input 
          type="text" 
          name="firstName" 
          value={formData.firstName} 
          onChange={handleChange} 
          required 
        />

      
        <label>Last Name *</label>
        <input 
          type="text" 
          name="lastName" 
          value={formData.lastName} 
          onChange={handleChange} 
          required 
        />

        
        <label>Graduation Year (Expected) *</label>
        <input 
          type="number" 
          name="graduationYear" 
          value={formData.graduationYear} 
          onChange={handleChange} 
          required 
        />

     
        <label>CGPA *</label>
        <input 
          type="text" 
          name="cgpa" 
          value={formData.cgpa} 
          onChange={handleChange} 
          required 
        />

       
        <label>LinkedIn Profile *</label>
        <input 
          type="url" 
          name="linkedin" 
          value={formData.linkedin} 
          onChange={handleChange} 
          required 
        />

      
        <label>Upload Resume (PDF) *</label>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          required 
        />

        
        <label>Current Location *</label>
        <input 
          type="text" 
          name="location" 
          value={formData.location} 
          onChange={handleChange} 
          required 
        />

       
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}
