import React, { useState } from 'react';
import './StationSelector.css';

function StationSelector({ stations, onRequestData }) {
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({
    temperature: false,
    humidity: false,
    pressure: false,
    windSpeed: false,
    visibility: false
  });

  // Handle station selection
  const handleStationChange = (event) => {
    setSelectedStation(event.target.value);
  };

  // Handle attribute selection
  const handleAttributeChange = (event) => {
    const { name, checked } = event.target;
    setSelectedAttributes((prevAttributes) => ({
      ...prevAttributes,
      [name]: checked
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    const attributes = Object.keys(selectedAttributes).filter((key) => selectedAttributes[key]);

    if (!selectedStation) {
      alert('Please select a station');
      return;
    }
    if (attributes.length === 0) {
      alert('Please select at least one attribute');
      return;
    }

    onRequestData(selectedStation, attributes);
  };

  return (
    <div className="station-selector">
      {/* Dropdown to select station */}
      <select value={selectedStation} onChange={handleStationChange}>
        <option value="">Select a station</option>
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>

      {/* Checklist for selecting attributes */}
      <div className="attributes-checklist">
        {Object.keys(selectedAttributes).map((attribute) => (
          <label key={attribute}>
            <input
              type="checkbox"
              name={attribute}
              checked={selectedAttributes[attribute]}
              onChange={handleAttributeChange}
            />
            {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
          </label>
        ))}
      </div>

      {/* Submit button */}
      <button onClick={handleSubmit}>Get Weather</button>
    </div>
  );
}

export default StationSelector;
