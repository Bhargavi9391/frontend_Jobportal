import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import Navbar from "./Navbar";

const Email = () => {
  const [message, setMessage] = useState("");

  const handleEmailClick = () => {
    const subject = "Query";
    const body = encodeURIComponent(message);
    window.location.href = `mailto:owner@gmail.com?subject=${subject}&body=${body}`;
    saveMessageToBackend(subject, body);
  };

  const saveMessageToBackend = async (subject, body) => {
    try {
      const response = await axios.post('http://localhost:5000/save-message', {
        email: 'owner@gmail.com',
        subject: subject,
        body: body,
      });
      console.log('Message saved:', response.data);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  return (
    <div className="email-icon-wrapper">
      <a href="mailto:owner@gmail.com?subject=Query&body=Please enter your message here" target="_blank" rel="noopener noreferrer">
        <FaEnvelope className="email-icon" onClick={handleEmailClick} />
      </a>
      <div className="tooltip">If you have any queries, email the admin.</div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message..."
      />
    </div>
  );
};

export default Email;
