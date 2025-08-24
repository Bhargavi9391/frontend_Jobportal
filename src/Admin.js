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
      getJobsFromDB().then((data) => {
        setSubmittedData(data);
      });
    }, []);
  
    useEffect(() => {
      if (submittedData.length > 0) {
        saveJobsToDB([...submittedData]);
      }
    }, [submittedData]);
  
   const jobDescriptions = {
    "Software Engineer": "Designs, develops, and optimizes software applications. Requires strong programming skills, problem-solving abilities, and knowledge of data structures, algorithms, and software development methodologies.",
    "Frontend Developer": "Builds responsive, dynamic, and user-friendly interfaces using modern frontend technologies like React, Angular, or Vue. Requires expertise in HTML, CSS, JavaScript, state management (Redux/Zustand), and UI/UX principles.",
    "Backend Developer": "Handles business logic, databases, and API development. Requires proficiency in server-side technologies like Node.js, Python, or Java, database management (SQL/NoSQL), authentication, and REST/GraphQL APIs.",
    "Full Stack Developer": "Combines frontend and backend development to create complete web applications. Requires expertise in MERN stack (MongoDB, Express.js, React.js, Node.js) or similar, DevOps basics, cloud deployment, and database management.",
    "DevOps Engineer": "Automates development, testing, and deployment pipelines. Requires knowledge of CI/CD tools (Jenkins, GitHub Actions), cloud platforms (AWS, Azure, GCP), Kubernetes, Docker, Linux, and scripting languages like Bash or Python.",
    "Data Scientist": "Processes and analyzes large datasets to extract meaningful insights. Requires proficiency in Python, R, SQL, machine learning algorithms, statistical analysis, data visualization, and tools like TensorFlow and Pandas.",
    "Machine Learning Engineer": "Builds, trains, and deploys machine learning models for automation and AI applications. Requires expertise in deep learning, natural language processing (NLP), computer vision, and ML frameworks like PyTorch or TensorFlow.",
    "Cyber Security Analyst": "Protects systems, networks, and data from security threats. Requires skills in ethical hacking, penetration testing, encryption, network security, SIEM tools, and cybersecurity frameworks like NIST and OWASP.",
    "Cloud Engineer": "Designs and manages cloud-based solutions for scalability and security. Requires expertise in AWS, Azure, or Google Cloud, containerization (Docker, Kubernetes), cloud networking, and infrastructure as code (Terraform).",
    "UI/UX Designer": "Creates visually appealing and user-friendly digital experiences. Requires skills in wireframing, prototyping, Figma, Adobe XD, usability testing, user research, accessibility, and responsive design principles."
  };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
  
      setJobData((prevData) => ({
        ...prevData,
        [name]: value,
        description: name === "position" ? jobDescriptions[value] || "" : prevData.description
      }));
    };
  
   const handleSkillsChange = (e) => {
    const selectedSkill = e.target.value;
    if (selectedSkill && !jobData.skills.includes(selectedSkill)) {
      setJobData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, selectedSkill]
      }));
    }
  };
  
  
    // const handleSubmit = (e) => {
    //   e.preventDefault();
  
    //   if (!jobData.position || !jobData.company) {
    //     alert("Please fill in required fields.");
    //     return;
    //   }
  
    //   let updatedData = [...submittedData];
  
    //   if (editingIndex !== null) {
    //     updatedData[editingIndex] = { ...jobData };
    //   } else {
    //     updatedData.push(jobData);
    //   }
  
    //   setSubmittedData(updatedData);
    //   setEditingIndex(null);
  
    //   // Clear form
    //   setJobData({
    //     position: "",
    //     company: "",
    //     location: "",
    //     workType: "",
    //     expectedYear: "",
    //     description: "",
    //     vacancies: "",
    //     salary: "",
    //     skills: [],
    //     education: ""
    //   });
    // };
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

  // 🚀 Auto-post job to backend
  handlePostJob(jobData);

  // Clear form
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
    const formattedJobData = {
      ...job,
      postedTime: new Date().toISOString(),
      expectedYear: Number(job.expectedYear),
      vacancies: Number(job.vacancies||0),
      skills: Array.isArray(job.skills)
        ? job.skills
        : typeof job.skills === "string"
          ? job.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [],
    };
  
    try {
      const res = await axios.post(
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
             <label className="form-label">Position:</label>
             <select name="position" value={jobData.position} onChange={handleChange} className="form-input" required>
               <option value="">Select Position</option>
               {Object.keys(jobDescriptions).map((position) => (
                 <option key={position} value={position}>
                   {position}
                 </option>
               ))}
             </select>
           </div>
   
           {/* Company */}
           <div className="form-group">
             <label className="form-label">Company:</label>
             <select name="company" value={jobData.company} onChange={handleChange} className="form-input" required>
               <option value="">Select Company</option>
               {["Google", "Amazon", "Microsoft", "Facebook", "Apple", "Netflix", "Tesla", "IBM", "Adobe", "Salesforce"].map((company) => (
                 <option key={company} value={company}>
                   {company}
                 </option>
               ))}
             </select>
           </div>
   
           {/* Expected Year */}
           <div className="form-group">
             <label className="form-label">Expected Year of Joining:</label>
             <select name="expectedYear" value={jobData.expectedYear} onChange={handleChange} className="form-input" required>
               <option value="">Select Year</option>
               {Array.from({ length: 9 }, (_, i) => 2020 + i).map((year) => (
                 <option key={year} value={year}>
                   {year}
                 </option>
               ))}
             </select>
           </div>
   
           {/* Work Type */}
           <div className="form-group">
             <label className="form-label">Work Type:</label>
             <select name="workType" value={jobData.workType} onChange={handleChange} className="form-input" required>
               <option value="">Select Work Type</option>
               {["Full-time", "Internship", "Fresher", "Remote", "Hybrid", "Work from Office"].map((type) => (
                 <option key={type} value={type}>
                   {type}
                 </option>
               ))}
             </select>
           </div>
   
           {/* Location */}
           <div className="form-group">
             <label className="form-label">Location:</label>
             <select name="location" value={jobData.location} onChange={handleChange} className="form-input" required>
               <option value="">Select Location</option>
               {[
                 "Delhi, Delhi", "Pune, Maharashtra", "Kolkata, West Bengal", "Chandigarh, Punjab", "Ahmedabad, Gujarat",
                 "Jaipur, Rajasthan", "Indore, Madhya Pradesh", "Coimbatore, Tamil Nadu", "Visakhapatnam, Andhra Pradesh",
                 "Lucknow, Uttar Pradesh", "Bhubaneswar, Odisha", "Thiruvananthapuram, Kerala", "Nagpur, Maharashtra",
                 "Mysore, Karnataka", "Surat, Gujarat"
               ].map((loc) => (
                 <option key={loc} value={loc}>
                   {loc}
                 </option>
               ))}
             </select>
           </div>
   
           {/* Skills */}
           <div className="form-group">
             <label className="form-label">Skills:</label>
             <select name="skills" onChange={handleSkillsChange} className="form-input">
               <option value="">Select Skills</option>
               {["React.js", "Node.js", "MongoDB", "Express.js", "HTML", "CSS", "JavaScript", "Python", "Java", "C++"].map((skill) => (
                 <option key={skill} value={skill}>
                   {skill}
                 </option>
               ))}
             </select>
             <div className="selected-skills">
               {jobData.skills.map((skill, index) => (
                 <span key={skill} className="skill-tag">
                   {skill}
                   {index < jobData.skills.length - 1 ? ", " : ""}
                 </span>
               ))}
             </div>
           </div>
   
           {/* Education */}
           <div className="form-group">
             <label className="form-label">Education:</label>
             <select name="education" value={jobData.education} onChange={handleChange} className="form-input" required>
               <option value="">Select Education</option>
               {["B.Tech", "M.Tech", "BCA", "MCA"].map((ed) => (
                 <option key={ed} value={ed}>
                   {ed}
                 </option>
               ))}
             </select>
           </div>
   
           {/* Salary */}
           <div className="form-group">
             <label className="form-label">Salary:</label>
             <select name="salary" value={jobData.salary} onChange={handleChange} className="form-input" required>
               <option value="">Select Salary</option>
               {["10,000-50,000", "50,000-1,00,000", "1,00,000-1,50,000", "1,50,000-2,00,000", "2,00,000-3,00,000", "3,00,000-5,00,000", "5,00,000+"].map((sal) => (
                 <option key={sal} value={sal}>
                   {sal}
                 </option>
               ))}
             </select>
           </div>
   
           {/* Description */}
           <div className="form-group">
             <label className="form-label">Description:</label>
             <textarea name="description" value={jobData.description} onChange={handleChange} className="form-input" required />
           </div>
   
           {/* Vacancies */}
           <div className="form-group">
             <label className="form-label">Vacancies:</label>
             <input type="number" name="vacancies" value={jobData.vacancies} onChange={handleChange} className="form-input" required />
           </div>
   
           <button type="submit" className="submit-btn">
             {editingIndex !== null ? "Update Job" : "Submit Job"}
           </button>
         </form>
   
         {/* Posted Jobs List */}
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
                 <p><strong>Expected Year of Joining:</strong> {job.expectedYear}</p>
                 <div className="button-container">
                   <button className="edit-button" onClick={() => handleEdit(index)}>Edit</button>
                   <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
                  <button type="button" className="post-btn" onClick={() => handlePostJob(job)}>Post</button>
  
  
   
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
