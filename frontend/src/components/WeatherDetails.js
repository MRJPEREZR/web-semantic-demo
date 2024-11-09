import React from 'react';
import './WeatherDetails.css';

function WeatherDetails({ details }) {
  return (
    <div className="weather-details">
      {details.map((detail, index) => (
        <div key={index} className="detail-item">
          <p className="label">{detail.label}</p>
          <p className="value">{detail.value}</p>
        </div>
      ))}
    </div>
  );
}

export default WeatherDetails;
