
import './StatisticsPage.css';
import React, { useState } from "react";
import { FaTemperatureHigh, FaWind, FaPercentage, FaCloudRain } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Bar from '../components/bar';
import TemperatureChart from '../components/diagramm';

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
    const [month, setMonth] = useState('');
    const [weatherData, setWeatherData] = useState({
      averageTemp: 'N/A',
      minTemp: 'N/A',
      maxTemp: 'N/A',
      averageHumidity: 'N/A',
      minHumidity: 'N/A',
      maxHumidity: 'N/A',
      averagePressure: 'N/A',
      minPressure: 'N/A',
      maxPressure: 'N/A',
      averageWind: 'N/A',
      minWind: 'N/A',
      maxWind: 'N/A',
    });

    // Transform value helper
    const transformValue = (attribute, value) => {
      if (value === undefined || value === null) return 'N/A';

      if (attribute === 'Temperature') {
        return (value - 273.15).toFixed(2); // Kelvin to Celsius
      }

      if (attribute === 'Pressure') {
        return (value / 1000).toFixed(2); // Convert to kilopascals
      }

      if (attribute === 'WindSpeed') {
        return (value * 3.6).toFixed(2); // Convert to km/h
      }

      return parseFloat(value).toFixed(2); // Default case
    };

    const extractWeatherData = (data) => {
      const temperatureData = data.results?.bindings?.find(attr => attr.observedProperty.value.includes('Temperature'));
      const pressureData = data.results?.bindings?.find(attr => attr.observedProperty.value.includes('Pressure'));
      const humidityData = data.results?.bindings?.find(attr => attr.observedProperty.value.includes('Humidity'));
      const windSpeedData = data.results?.bindings?.find(attr => attr.observedProperty.value.includes('WindSpeed'));

      return {
        averageTemp: transformValue('Temperature', temperatureData?.average?.value),
        minTemp: transformValue('Temperature', temperatureData?.min?.value), 
        maxTemp: transformValue('Temperature', temperatureData?.max?.value), 
        averagePressure: transformValue('Pressure', pressureData?.average?.value),
        minPressure: transformValue('Pressure', pressureData?.min?.value), 
        maxPressure: transformValue('Pressure', pressureData?.max?.value), 
        averageHumidity: transformValue('Humidity', humidityData?.average?.value),
        minHumidity: transformValue('Humidity', humidityData?.min?.value), 
        maxHumidity: transformValue('Humidity', humidityData?.max?.value), 
        averageWind: transformValue('WindSpeed', windSpeedData?.average?.value),
        minWind: transformValue('WindSpeed', windSpeedData?.min?.value), 
        maxWind: transformValue('WindSpeed', windSpeedData?.max?.value), 
      };
    };

    const handleStationChange = (e) => {
      setSelectedStation(e.target.value);
    };

    const handleMonthChange = (e) => {
      setMonth(Number(e.target.value));
    };

    const handleDataRequest = async () => {
      if (!selectedStation || month === "") {
        alert("Veuillez sélectionner une station et un mois.");
        return;
      }

      const body = {
        stationId: selectedStation,
        attributes: ["Temperature", "Humidity", "Pressure", "WindSpeed"],
        dateTime: `2024-${(month + 1).toString().padStart(2, "0")}`
      };

      try {
        const response = await fetch("http://localhost:8080/sparqlv2/queryPerMonth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération des données");

        const data = await response.json();
        const processedData = extractWeatherData(data);
        setWeatherData(processedData);

      } catch (error) {
        console.error(error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    };

    // redirects to the new TextSubmitPage
  const navigate = useNavigate();

    return (
      <div className="App">
        <div className="selector">
          <div>
            <label>Choose a station:</label>
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
          <button onClick={handleDataRequest}>Get Weather Data</button>
        </div>

        <h1>Monthly Weather forecast for {stations.find((s) => s.id === selectedStation)?.name} station</h1>

        <div className='result'>
          <div className='col'>
            <h2>Average Statistics</h2>
            <div className='result2'>
              <div className='box'>
                <div className="col2"><FaTemperatureHigh /><p>Temperature</p></div>
                <h4 className='p3'>
                  mean:
                  <span style={{ color: '#4682B4', fontSize: '40px', fontWeight: 'bold', display: 'block' }}>
                    {weatherData.averageTemp} °C
                  </span>
                </h4>
                <Bar minV={weatherData.minTemp} maxV={weatherData.maxTemp} mean={weatherData.averageTemp} />
              </div>

              <div className='box'>
                <div className="col2"><FaPercentage /><p>Humidity</p></div>
                <h4>mean: 
                  <span style={{ color: '#4682B4', fontSize: '40px', fontWeight: 'bold', display: 'block' }}>{weatherData.averageHumidity} %</span>
                </h4>
                <Bar minV={weatherData.minHumidity} maxV={weatherData.maxHumidity} mean={weatherData.averageHumidity} />
              </div>
              <div className='box'>
                <div className="col2"><FaCloudRain /><p>Pressure</p></div>
                <h4>mean: 
                  <span style={{ color: '#4682B4', fontSize: '40px', fontWeight: 'bold', display: 'block' }}>{weatherData.averagePressure} kPa</span>
                </h4>
                <Bar minV={weatherData.minPressure} maxV={weatherData.maxPressure} mean={weatherData.averagePressure} />
              </div>
              <div className='box'>
                <div className="col2"><FaWind /><p>Wind Speed</p></div>
                <h4>mean: 
                  <span style={{color: '#4682B4', fontSize: '40px', fontWeight: 'bold', display: 'block' }}>{weatherData.averageWind} km/h</span>
                </h4>
                <Bar minV={weatherData.minWind} maxV={weatherData.maxWind} mean={weatherData.averageWind} />
              </div>
            </div>
          </div>
        </div>


{/* mois les plus chauds et mois les plus froids*/}
        <div style={{display: "flex", flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <div className='result'>
            <div className='col'>
            <h2 style={{margin:'40px'}}>Focus on the hottest and the coldest months of 2024</h2>
            <TemperatureChart/>
            </div>
            
            


          </div>
          

        </div>



        <button onClick={() => navigate('/')}>back</button>
      </div>
    );
}

export default StatisticsPage;
