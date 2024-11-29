
import './StatisticsPage.css';
import React, { useState } from "react";
import { FaTemperatureHigh, FaWind, FaPercentage, FaCloudRain } from 'react-icons/fa';
import Bar from '../components/bar';

// Sample station data for selection
const stations = [
  { id: '07005', name: 'ABBEVILLE' },
  { id: '07015', name: 'LILLE-LESQUIN' },
  { id: '07020', name: 'PTE DE LA HAGUE' },
  { id: '07027', name: 'CAEN-CARPIQUET' },
  { id: '07037', name: 'ROUEN-BOOS' },
  { id: '07072', name: 'REIMS-PRUNAY' },
  { id: '07110', name: 'BREST-GUIPAVAS' },
  { id: '07117', name: 'PLOUMANACH' },
  { id: '07130', name: 'RENNES-ST JACQUES' },
  { id: '07139', name: 'ALENCON' },
  { id: '07149', name: 'ORLY' },
  { id: '07168', name: 'TROYES-BARBEREY' },
  { id: '07181', name: 'NANCY-OCHEY' },
  { id: '07190', name: 'STRASBOURG-ENTZHEIM' },
  { id: '07207', name: 'BELLE ILE-LE TALUT' },
  { id: '07222', name: 'NANTES-BOUGUENAIS' },
  { id: '07240', name: 'TOURS' },
  { id: '07255', name: 'BOURGES' },
  { id: '07280', name: 'DIJON-LONGVIC' },
  { id: '07299', name: 'BALE-MULHOUSE' },
  { id: '07314', name: 'PTE DE CHASSIRON' },
  { id: '07335', name: 'POITIERS-BIARD' },
  { id: '07434', name: 'LIMOGES-BELLEGARDE' },
  { id: '07460', name: 'CLERMONT-FD' },
  { id: '07471', name: 'LE PUY-LOUDES' },
  { id: '07481', name: 'LYON-ST EXUPERY' },
  { id: '07510', name: 'BORDEAUX-MERIGNAC' },
  { id: '07535', name: 'GOURDON' },
  { id: '07558', name: 'MILLAU' },
  { id: '07577', name: 'MONTELIMAR' },
  { id: '07591', name: 'EMBRUN' },
  { id: '07607', name: 'MONT-DE-MARSAN' },
  { id: '07621', name: 'TARBES-OSSUN' },
  { id: '07627', name: 'ST GIRONS' },
  { id: '07630', name: 'TOULOUSE-BLAGNAC' },
  { id: '07643', name: 'MONTPELLIER' },
  { id: '07650', name: 'MARIGNANE' },
  { id: '07661', name: 'CAP CEPET' },
  { id: '07690', name: 'NICE' },
  { id: '07747', name: 'PERPIGNAN' },
  { id: '07761', name: 'AJACCIO' },
  { id: '07790', name: 'BASTIA' },
  { id: '61968', name: 'GLORIEUSES' },
  { id: '61970', name: 'JUAN DE NOVA' },
  { id: '61972', name: 'EUROPA' },
  { id: '61976', name: 'TROMELIN' },
  { id: '61980', name: 'GILLOT-AEROPORT' },
  { id: '61996', name: 'NOUVELLE AMSTERDAM' },
  { id: '61997', name: 'CROZET' },
  { id: '61998', name: 'KERGUELEN' },
  { id: '67005', name: 'PAMANDZI' },
  { id: '71805', name: 'ST-PIERRE' },
  { id: '78890', name: 'LA DESIRADE METEO' },
  { id: '78894', name: 'ST-BARTHELEMY METEO' },
  { id: '78897', name: 'LE RAIZET AERO' },
  { id: '78922', name: 'TRINITE-CARAVEL' },
  { id: '78925', name: 'LAMENTIN-AERO' },
  { id: '81401', name: 'SAINT LAURENT' },
  { id: '81405', name: 'CAYENNE-MATOURY' },
  { id: '81408', name: 'SAINT GEORGES' },
  { id: '81415', name: 'MARIPASOULA' },
  { id: '89642', name: 'DUMONT D URVILLE' }
];

const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

function StatisticsPage() {
    const [selectedStation, setSelectedStation] = useState('');
    const [month, setMonth] = useState('');  // Index du mois (0 = Janvier)
    const [weatherData, setWeatherData] = useState({
      highestTemp: 0,
      lowestTemp: 0,
      highestDay: "N/A",
      lowestDay: "N/A",
      averageTemp: 0,
    });

      // Handle selection of station
    const handleStationChange = (e) => {
      setSelectedStation(e.target.value);
    };

     // Handle selection of month
     const handleMonthChange = (e) => {
      setMonth(Number(e.target.value));
    };

    const handleDataRequest = async () => {
      console.log("Station selected:", selectedStation); 
      console.log("Month selected:", month); 

      if (!selectedStation || month === "") {
        alert("Veuillez sélectionner une station et un mois.");
        return;
      }
    
      const attributes = ["Temperature", "Humidity", "Pressure", "WindSpeed"]; // Les attributs requis
      const body = {
        stationId: selectedStation,
        attributes: attributes,
        dateTime: `2024-${(month + 1).toString().padStart(2, "0")}` // Format : YYYY-MM
      };

      console.log(body);
    
      try {
        const response = await fetch("http://localhost:8080/sparqlv2/queryPerMonth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        console.log("Response Status:", response.status);
    
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
    
        const data = await response.json();
        console.log(data); // Pour tester la réponse
        updateWeatherData(data); // Mise à jour des données météorologiques
      } catch (error) {
        console.error("Error:",error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    };
    const updateWeatherData = (data) => {
      console.log("Weather data before processing:", data);
  // Transforme les résultats en un format lisible
  const weatherStats = {
    averageTemp: data.results?.bindings?.find(x => x.observedProperty.value.includes("Temperature"))?.average?.value || "N/A",
    averageHumidity: data.results?.bindings?.find(x => x.observedProperty.value.includes("Humidity"))?.average?.value || "N/A",
    averagePressure: data.results?.bindings?.find(x => x.observedProperty.value.includes("Pressure"))?.average?.value || "N/A",
    averageWind: data.results?.bindings?.find(x => x.observedProperty.value.includes("WindSpeed"))?.average?.value || "N/A",
  };

  console.log("Processed weather stats:", weatherStats); // Vérification des données traitées

  setWeatherData(weatherStats);
};


  
    return (
      <div className="App">
         <div className="selector">
          <div>
            <label >Choose a station:</label>
            <select id="station" value={selectedStation} onChange={handleStationChange}>
            <option value="">-- Select a Station --</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>

          </div>
  
          <div>
            <label>Choose the month:</label>
            <select value={month} onChange={handleMonthChange}>
            <option value="">-- Select a month --</option>
              {months.map((monthName, index) => (
                <option key={index} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
          </div>
          {/* Fetch Data Button */}

          <button onClick={handleDataRequest}>

          Get Weather Data
          </button>
        </div>
        <h1>Weather forecast for {stations.find((s) => s.id === selectedStation)?.name} station</h1>
  
       
  
        {/* Affichage des résultats avec des valeurs statiques */}
        <div className='result'>
          <div className='col'><h2 >Average Statistics</h2>
            <div className='result2'>
              <div className='box' >
                <div className="col2"><FaTemperatureHigh/><p >Temperature</p></div>
                
                <h4 className='p3'>mean:{weatherData.averageTemp} °C</h4>

                {/* put here the average temparature for the city selected*/}
                <Bar/>
              </div> 
              <div className='box'>
                <div className="col2"><FaPercentage/><p>Humidity</p></div>
                  <h4>mean:{weatherData.averageHumidity}</h4>
                  {/* put here the average humidity for the city selected*/}
                  <Bar/>
                
              </div>
              <div className='box'>
                <div className="col2">
                  <FaCloudRain/><p >Pressure</p>
                </div>
                <h4>mean:{weatherData.averagePressure}</h4>
                {/* put here the average pressure for the city selected*/}
                <Bar/>
              </div> 
              <div className='box'>
                <div className="col2">
                  <FaWind/><p >Wind Speed</p>
                </div>
                <h4>mean:{weatherData.averageWind}</h4>
                {/* put here the average wind speed for the city selected*/}
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
