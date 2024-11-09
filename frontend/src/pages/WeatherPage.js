import React, { useState } from 'react';
import Header from '../components/Header';
import WeatherMainInfo from '../components/WeatherMainInfo';
import WeatherIconList from '../components/WeatherIconList';
import WeatherDetails from '../components/WeatherDetails';
import StationSelector from '../components/StationSelector';
import './WeatherPage.css';

function WeatherPage() {
  // Sample station data
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

  const [weatherData, setWeatherData] = useState(null);

  // Function to handle data request based on selected station and attributes
  const handleDataRequest = async (stationId, attributes) => {
    try {
      // Build the query string for attributes
      const requestBody = {
        "sparqlQuery" : "SELECT FROM <http://example.org/dataset> WHERE {?s ?p ?o}"
      }

      // Make an API call to your backend with the station ID and selected attributes
      const response = await fetch("http://localhost:8080/sparql/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Update weather data state
      setWeatherData({
        temperature: data.temperature,
        description: data.description,
        icons: data.icons,
        details: data.details
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="weather-page">
      <Header />
      <StationSelector stations={stations} onRequestData={handleDataRequest} />

      {weatherData ? (
        <>
          <WeatherMainInfo temperature={weatherData.temperature} description={weatherData.description} />
          <WeatherIconList icons={weatherData.icons} />
          <WeatherDetails details={weatherData.details} />
        </>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>Select a station and attributes to view weather information.</p>
      )}
    </div>
  );
}

export default WeatherPage;
