import React, { useState } from 'react';
import Header from '../components/Header';
import './WeatherPage.css';

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

// Available attributes for user selection
const attributesList = [
  { key: 'Temperature', label: 'Temperature' },
  { key: 'Humidity', label: 'Humidity' },
  { key: 'Pressure', label: 'Pressure' },
  { key: 'WindSpeed', label: 'Wind Speed' }
];

function WeatherPage() {
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [rawResponse, setRawResponse] = useState(''); // New state for raw response string
  const [loading, setLoading] = useState(false);

  // Handle selection of station
  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  // Handle attribute selection (checkboxes)
  const handleAttributeChange = (attributeKey) => {
    setSelectedAttributes((prevAttributes) =>
      prevAttributes.includes(attributeKey)
        ? prevAttributes.filter((attr) => attr !== attributeKey)
        : [...prevAttributes, attributeKey]
    );
  };

  // Fetch weather data based on selected station and attributes
  const handleDataRequest = async () => {
    setLoading(true);
    setWeatherData(null);
    setRawResponse(''); // Clear previous raw response

    const requestBody = {
      stationId: selectedStation,
      attributes: selectedAttributes
    };

    try {
      const response = await fetch('http://localhost:8080/sparql/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      // Update both structured weather data and raw response string
      setWeatherData(data);
      setRawResponse(JSON.stringify(data, null, 2)); // Pretty-print JSON for readability
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setRawResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-page">
      <Header />
      <div className="selection-container">
        <h2>Select Station and Attributes</h2>

        {/* Station Selection */}
        <label htmlFor="station">Select Station:</label>
        <select id="station" value={selectedStation} onChange={handleStationChange}>
          <option value="">-- Select a Station --</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>

        {/* Attributes Selection */}
        <h3>Select Attributes:</h3>
        <div className="attributes-checkboxes">
          {attributesList.map((attribute) => (
            <label key={attribute.key}>
              <input
                type="checkbox"
                checked={selectedAttributes.includes(attribute.key)}
                onChange={() => handleAttributeChange(attribute.key)}
              />
              {attribute.label}
            </label>
          ))}
        </div>

        {/* Fetch Data Button */}
        <button onClick={handleDataRequest} disabled={!selectedStation || selectedAttributes.length === 0}>
          Get Weather Data
        </button>
      </div>

      <div className="weather-data">
        {loading ? (
          <p>Loading...</p>
        ) : weatherData ? (
          <>
            <h2>Weather Data for {stations.find((s) => s.id === selectedStation)?.name}</h2>
            <ul>
              {selectedAttributes.map((attribute) => {
                // Find the specific weather data for this attribute
                const attributeData = weatherData.results.bindings.find(
                  (binding) => binding.observedProperty.value.endsWith(attribute)
                );

                // Get the result value or "N/A" if not available
                const resultValue = attributeData ? attributeData.result.value : 'N/A';

                return (
                  <li key={attribute}>
                    {attributesList.find((attr) => attr.key === attribute)?.label}: {resultValue}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p style={{ color: '#666' }}>Select a station and attributes to view weather data.</p>
        )}
      </div>


      {/* Raw Response Text Box */}
      <div className="raw-response">
        <h3>Raw Response</h3>
        <textarea readOnly value={rawResponse} rows={10} cols={50} />
      </div>
    </div>
  );
}

export default WeatherPage;
