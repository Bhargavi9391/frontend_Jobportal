import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Icon.css"; 


function Icon() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");  
    }, 3000);
    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="icon-container">
     <img src={`${process.env.PUBLIC_URL}/craft.webp`} alt="Test Icon" className="icon-img" />

      <h1>Carrer<span style={{color:'#E74C3C', fontSize:'17px'}}>crafter</span></h1>
    </div>
  );
}

export default Icon;
