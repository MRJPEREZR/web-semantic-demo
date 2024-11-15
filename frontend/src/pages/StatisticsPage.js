
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
  
    // useEffect est commenté car nous n'appelons pas l'API pour l'instant
    // useEffect(() => {
    //   if (city && month !== null) {
    //     fetchWeatherData(city, month);
    //   }
    // }, [city, month]);
  
    // Fonction de récupération des données météo commentée
    // const fetchWeatherData = async (city, month) => {
    //   try {
    //     const response = await axios.get(
    //       `https://api.openweathermap.org/data/2.5/forecast`,
    //       {
    //         params: {
    //           q: city,
    //           appid: API_KEY,
    //           units: "metric",
    //           cnt: 40,  // Nombre de prévisions à récupérer (toutes les 3 heures)
    //         },
    //       }
    //     );
    //     // Traitement des données de l'API commenté
    //   } catch (error) {
    //     console.error("Erreur de récupération des données météo:", error);
    //   }
    // };
  
    return (
      <div className="App">
         <div className="selector">
          <div>
            <label >Choisir la ville:</label>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <label>Choisir le mois:</label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {months.map((monthName, index) => (
                <option key={index} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <h1>Météo pour {city}</h1>
  
       
  
        {/* Affichage des résultats avec des valeurs statiques */}
        <div className="result">
            <div className="col">
                <h2>Température la plus haute du mois</h2>
                <div className='result2'>
                    <div className="col2"><p className='p1'>{weatherData.highestTemp}°C</p> 
                      {/*<FaSun size={50} color="#ffcc00" />*/}
                    </div>
                    <div className="col2"><p>le {weatherData.highestDay}</p></div>
                 
                </div>
                
            </div>
            <div className="col">
              <h2>Température la plus basse du mois</h2>
              <div className='result2'>
                <div className='col2'><p className='p2'>{weatherData.lowestTemp}°C</p></div>
                <div className='col2'> <p>le {weatherData.lowestDay}</p></div>
              </div>
                
                 
                {/*<FaCloud size={50} color="#3498db" />*/}
            </div>

        </div>
          
          
      </div>
    );
  
};



export default StatisticsPage;
