import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './WeatherPage.css';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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
  const responseTextareaRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(null);

  const formatDateToSPARQL = (date) => {
    const localDate = new Date(date);
    // Set the time to 00:00:00 local time
    localDate.setHours(9, 0, 0, 0);  // Set time to 00:00:00 and reset milliseconds
    // Format to ISO string, but make sure it represents the correct local time
    return localDate.toISOString().split('T')[0] + "T00:00:00";
  };

  // Handle selection date
  const handleDateChange = (date) => {
    // Ensure the year is always 2024
    const fixedYearDate = new Date(date);
    fixedYearDate.setFullYear(2024);
    setSelectedDate(fixedYearDate);
  };

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

    const formattedDate = formatDateToSPARQL(selectedDate);
    console.log(formattedDate);

    const requestBody = {
      stationId: selectedStation,
      attributes: selectedAttributes,
      dateTime: formattedDate
    };

    try {
      const response = await fetch('http://localhost:8080/sparql/queryPerDay', {
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

    // Function to adjust the height of the textarea based on content
    const adjustTextareaHeight = () => {
      if (responseTextareaRef.current) {
        responseTextareaRef.current.style.height = 'auto'; // Reset height
        responseTextareaRef.current.style.height = `${responseTextareaRef.current.scrollHeight}px`; // Set to content height
      }
    };
  
    // Adjust height whenever apiResponse changes
    useEffect(() => {
      adjustTextareaHeight();
    }, [rawResponse]);

  // redirects to the new TextSubmitPage
  const navigate = useNavigate();

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

        {/* Date Picker */}
        <div>
          <label htmlFor="date">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yy-MM-dd"
            placeholderText="Select a date"
            id="date-picker"
            monthsShown={1}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            minDate={new Date(2024, 0, 1)} // Start from Jan 1, 2024
            maxDate={new Date(2024, 11, 31)} // End at Dec 31, 2024
            calendarClassName="scrollable-months"
            renderCustomHeader={({ date, changeYear, changeMonth, monthDate }) => (
              <div className="custom-header">
                {/* Dropdown for Months */}
                <select
                  value={new Date(date).getMonth()}
                  onChange={(e) => changeMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>

                {/* Dropdown for Years */}
                <select value={new Date(date).getFullYear()} onChange={(e) => changeYear(Number(e.target.value))}>
                  <option value={2024}>2024</option>
                </select>
              </div>
            )}
          />
        </div>

        {/* Fetch Data Button */}

        <button onClick={handleDataRequest} disabled={!selectedStation || selectedAttributes.length === 0 || !selectedDate}>

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
                
                // Get the result values or "N/A" if not available
                const transformValue = (attribute, value) => {
                  if (value === undefined || value === null) return 'N/A';
              
                  if (attribute === 'Temperature') {
                      return (value - 273.15).toFixed(2);
                      
                  }
              
                  if (attribute === 'Pressure') {
                      return (value / 1000).toFixed(2); // Convert to kilopascals
                  }

                  if (attribute === 'WindSpeed') {
                    return (value * 3.6).toFixed(2); // Convert to km/h
                }
              
                  return parseFloat(value).toFixed(2); // Default case for other attributes
                };
                // Helper function to get the result value
                const getResultValue = (attribute, data, type) => {
                  if (!data) return 'N/A';
                  const value = data[type]?.value;
                  return transformValue(attribute, value);
                };
                const resultAverage = getResultValue(attribute, attributeData, 'average');
                const resultMin = getResultValue(attribute, attributeData, 'min');
                const resultMax = getResultValue(attribute, attributeData, 'max');

                // Define the unit for each attribute
                const attributeUnits = {
                  Temperature: "°C",  // Celsius
                  Humidity: '%',     // Percentage
                  Pressure: "kPa",    // kilo Pascales
                  WindSpeed: 'km/h',  // kilometers per hour
                  // Add other attributes and their units here
                };

                // Get the unit for the current attribute
                const unit = attributeUnits[attribute] || ''; // Default to no unit if not found

                return (
                  <li key={attribute}>
                    {attributesList.find((attr) => attr.key === attribute)?.label}: average {resultAverage} {unit}, min {resultMin} {unit}, max {resultMax} {unit} 
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
        <textarea readOnly 
        ref={responseTextareaRef}
        style={{  overflow: 'hidden',
        borderRadius: '20px',
        border: '3px solid #4682B4', 
        padding: '10px'  }}
        value={rawResponse} />
      </div>

      {/* New button to navigate to TextSubmitPage */}
      <button onClick={() => navigate('/text-submit')}>Go to Custom Sparql Query Submission</button>

    </div>
  );
}

export default WeatherPage;
