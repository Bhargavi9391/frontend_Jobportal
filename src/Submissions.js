import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import "./Submissions.css";


export default function Submissions() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
   
    const storedApplications = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(storedApplications);
  }, []);

  
  const handleDelete = (index) => {
    const updatedApplications = [...applications];
    updatedApplications.splice(index, 1); 
    setApplications(updatedApplications);
    localStorage.setItem("applications", JSON.stringify(updatedApplications)); 
  };

  return (
    <div className="submissions-container">
    
      <FaArrowLeft className="back-icon" onClick={() => navigate("/home")} />

      <h2>My Job Applications</h2>

      {applications.length > 0 ? (
        <div className="applications-list">
          {applications.map((app, index) => (
            <div key={index} className="application-card">
              <h3>{app.jobTitle} at {app.company}</h3>
              <p><strong>Name:</strong> {app.firstName} {app.lastName}</p>
              <p><strong>Skills:</strong> {app.skills?.length > 0 ? app.skills.join(", ") : "Not Provided"}</p>
              <p><strong>Graduation Year:</strong> {app.graduationYear}</p>
              <p><strong>CGPA:</strong> {app.cgpa}</p>
              <p><strong>LinkedIn:</strong> <a href={app.linkedin} target="_blank" rel="noopener noreferrer">View Profile</a></p>
              <p><strong>Location:</strong> {app.location}</p>

              
              {app.resume ? (
                <p><strong>Resume:</strong> 
                  <a href={app.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
                </p>
              ) : (
                <p><strong>Resume:</strong> Not Uploaded</p>
              )}


              <FaTrash className="delete-icon" onClick={() => handleDelete(index)} />
            </div>
          ))}
        </div>
      ) : (
        <p>No job applications submitted yet.</p>
      )}
    </div>
  );
}
