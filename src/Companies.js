import React from "react";
import "./Companies.css";


const getRandomRating = () => (Math.random() * 4 + 1).toFixed(1); 

const companies = [
  { name: "Accenture", logo: "https://logo.clearbit.com/accenture.com", reviews: "5,200 reviews" },
  { name: "Google", logo: "https://logo.clearbit.com/google.com", reviews: "10,500 reviews" },
  { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", reviews: "8,900 reviews" },
  { name: "Infosys", logo: "https://logo.clearbit.com/infosys.com", reviews: "16,530 reviews" },
  { name: "TCS", logo: "https://logo.clearbit.com/tcs.com", reviews: "12,300 reviews" },
  { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com", reviews: "15,000 reviews" },
  { name: "Facebook", logo: "https://logo.clearbit.com/facebook.com", reviews: "9,200 reviews" },
  { name: "Tesla", logo: "https://logo.clearbit.com/tesla.com", reviews: "6,800 reviews" },
  { name: "Adobe", logo: "https://logo.clearbit.com/adobe.com", reviews: "4,500 reviews" },
  { name: "Netflix", logo: "https://logo.clearbit.com/netflix.com", reviews: "7,100 reviews" },
  { name: "IBM", logo: "https://logo.clearbit.com/ibm.com", reviews: "11,000 reviews" },
  { name: "Wipro", logo: "https://logo.clearbit.com/wipro.com", reviews: "9,300 reviews" },
  { name: "Cognizant", logo: "https://logo.clearbit.com/cognizant.com", reviews: "8,400 reviews" },
  { name: "Capgemini", logo: "https://logo.clearbit.com/capgemini.com", reviews: "7,600 reviews" },
  { name: "Oracle", logo: "https://logo.clearbit.com/oracle.com", reviews: "10,200 reviews" }
];

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0 ? "⭐" : "";
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {"⭐".repeat(fullStars)}
      {halfStar}
      {"☆".repeat(emptyStars)}
    </>
  );
};

export default function Companies() {
  return (
    <div className="companies-container">
      <h2 className="title">Popular Companies</h2>
      <div className="companies-grid">
        {companies.map((company, index) => {
          const rating = getRandomRating(); 
          return (
            <div key={index} className="company-card">
              <img src={company.logo} alt={company.name} className="company-logo" />
              <h3>{company.name}</h3>
              <div className="rating">{renderStars(rating)} ({rating})</div>
              <p className="reviews">{company.reviews}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
