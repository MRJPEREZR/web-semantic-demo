
import './StatisticsPage.css';
import React, { useState, useEffect } from "react";
//import axios from "axios";
import { FaSun, FaCloud, FaSnowflake } from "react-icons/fa";

//const API_KEY = "YOUR_API_KEY";  // Remplace par ta clé API OpenWeatherMap ou WeatherStack

const cities = [
  "Paris", "London", "New York", "Tokyo", "Sydney"
];

const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

function StatisticsPage() {
    const [city, setCity] = useState("Paris");
    const [month, setMonth] = useState(0);  // Index du mois (0 = Janvier)
    const [weatherData, setWeatherData] = useState({
      highestTemp: 25,
      lowestTemp: 10,
      highestDay: "15/01/24",
      lowestDay: "22/01/24",
    });
  

  
    return (
      <div className="App">
         <div className="selector">
          <div>
            <label >Choose a station:</label>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <label>Choose the month:</label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {months.map((monthName, index) => (
                <option key={index} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <h1>Weather forecast for {city} station</h1>
  
       
  
        {/* Affichage des résultats avec des valeurs statiques */}
        <div className="result">
            <div className="col">
                <h2>Highest temperature of the month</h2>
                <div className='result2'>
                    <div className="col2"><p className='p1'>{weatherData.highestTemp}°C</p> 
                      {/*<FaSun size={50} color="#ffcc00" />*/}
                    </div>
                    <div className="col2"><p> {weatherData.highestDay}</p></div>
                 
                </div>
                
            </div>
            <div className="col">
              <h2>Lowest temperature of the month</h2>
              <div className='result2'>
                <div className='col2'><p className='p2'>{weatherData.lowestTemp}°C</p></div>
                <div className='col2'> <p> {weatherData.lowestDay}</p></div>
              </div>
                
                 
                {/*<FaCloud size={50} color="#3498db" />*/}
            </div>

        </div>
          
          
      </div>
    );
  
};



export default StatisticsPage;
