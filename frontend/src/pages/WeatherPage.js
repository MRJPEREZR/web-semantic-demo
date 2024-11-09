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
    { id: 'station1', name: 'Station 1' },
    { id: 'station2', name: 'Station 2' },
    { id: 'station3', name: 'Station 3' }
  ];

  const [weatherData, setWeatherData] = useState(null);

  // Function to handle data request based on selected station and attributes
  const handleDataRequest = async (stationId, attributes) => {
    try {
      // Build the query string for attributes
      const queryString = attributes.join(',');

      // Make an API call to your backend with the station ID and selected attributes
      const response = await fetch(`http://your-backend-url.com/weather?station=${stationId}&attributes=${queryString}`);
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
