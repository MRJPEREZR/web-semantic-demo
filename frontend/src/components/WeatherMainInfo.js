import React from 'react';
import './WeatherMainInfo.css';

function WeatherMainInfo({ temperature, description }) {
  return (
    <div className="weather-main-info">
      <h2>{temperature}°C</h2>
      <p>{description}</p>
    </div>
  );
}

export default WeatherMainInfo;
