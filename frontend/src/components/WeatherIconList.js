import React from 'react';
import './WeatherIconList.css';

function WeatherIconList({ icons }) {
  return (
    <div className="weather-icon-list">
      {icons.map((icon, index) => (
        <div key={index} className="weather-icon">
          <img src={icon.src} alt={icon.alt} />
          <p>{icon.label}</p>
        </div>
      ))}
    </div>
  );
}

export default WeatherIconList;
