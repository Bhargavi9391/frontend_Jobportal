// More.js
import React from "react";
import "./More.css"; // Import the CSS file

const More = () => {
  return (
    <div className="more-container">
      <h1>Support & Contact</h1>
      
      <h2>Admin Details</h2>
      <p><strong>Name:</strong> Bhargavi</p>
      <p><strong>Email:</strong> admin@gmail.com</p>
      <p><strong>Phone:</strong> +91-9391194589</p>
      
      <h2>Support Contact</h2>
      <p>If you face any issues or need help, please reach out to us:</p>
      <ul>
        <li>Email: <strong>support@yourwebsite.com</strong></li>
        <li>Phone: <strong>+91-9391194589</strong></li>
        <li>Live Chat: Available 9 AM – 6 PM (IST)</li>
        <li>Help Desk: <a href="https://jobportal.com/help" target="_blank" rel="noopener noreferrer">Visit Help Center</a></li>
      </ul>

      <h2>Reviews & Feedback</h2>
      <p>We value your feedback! Please share your thoughts about our services.</p>
      <ul>
        <li><a href="https://jobportal.com/feedback" target="_blank" rel="noopener noreferrer">Submit a Review</a></li>
        <li><a href="mailto:bhargavijaddu06@gamil.com">Email Feedback</a></li>
        <li>WhatsApp us: <strong>+91-9391194589</strong></li>
      </ul>
    </div>
  );
};

export default More;
