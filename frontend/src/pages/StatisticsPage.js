
import './StatisticsPage.css';
import React, { useState } from "react";
import { FaTemperatureHigh, FaWind, FaPercentage, FaCloudRain } from 'react-icons/fa';
import Bar from '../components/bar';

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
      averageTemp: 22,
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
        <div className='result'>
          <div className='col'><h2 >Average Statistics</h2>
            <div className='result2'>
              <div className='box' >
                <div className="col2"><FaTemperatureHigh/><p >Temperature</p></div>
                <h4 className='p3'>mean:</h4>
                <Bar/>
              </div> 
              <div className='box'>
                <div className="col2"><FaPercentage/><p>Humidity</p></div>
                  <h4>mean:</h4>
                  <Bar/>
                
              </div>
              <div className='box'>
                <div className="col2">
                  <FaCloudRain/><p >Pressure</p>
                </div>
                <h4>mean:</h4>
                <Bar/>
              </div> 
              <div className='box'>
                <div className="col2">
                  <FaWind/><p >Wind Speed</p>
                </div>
                <h4>mean:</h4>
                <Bar/>
              </div> 
            </div>

          </div>

        </div>

        {/*not use
        <div className="result">
            <div className="col">
                <h2>Highest temperature of the month</h2>
                <div className='result2'>
                    <div className="col2"><p className='p1'>{weatherData.highestTemp}°C</p> 
                      
                    <div className="col2"><p> {weatherData.highestDay}</p></div>
                 
                </div>
                
            </div>
            <div className="col">
              <h2>Lowest temperature of the month</h2>
              <div className='result2'>
                <div className='col2'><p className='p2'>{weatherData.lowestTemp}°C</p></div>
                <div className='col2'> <p> {weatherData.lowestDay}</p></div>
              </div>
                
                 
                
            </div>

        </div>
      */}
          
          
      </div>
    );
  
};



export default StatisticsPage;
