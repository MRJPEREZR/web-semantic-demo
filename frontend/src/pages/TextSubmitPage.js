import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TextSubmitPage.css';

function TextSubmitPage() {
  const defaultText = "PREFIX ex:<http://example.org/station/> \nPREFIX sosa:<http://www.w3.org/ns/sosa/>\nSELECT ?observedProperty ?result ?resultTime\nFROM<http://example.org/dataset>\nWHERE{ ?observation a sosa:Observation ; sosa:hasFeatureOfInterest ex:omm_station_07005 ; sosa:observedProperty ?observedProperty ; sosa:hasSimpleResult ?result ; sosa:resultTime ?resultTime FILTER ( ( ?observedProperty = ex:Temperature ) || ( ?observedProperty = ex:Humidity ) ) } ORDER BY ?resultTime";
  const [inputText, setInputText] = useState(defaultText);
  const [apiResponse, setApiResponse] = useState('');
  const navigate = useNavigate();
  const responseTextareaRef = useRef(null);
  const inputTextareaRef = useRef(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/sparql/customQuery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: inputText }),
      });

      if (!response.ok) throw new Error('Failed to submit text');
      const data = await response.json();
      setApiResponse(JSON.stringify(data.results.bindings, null, 2)); // Format JSON with indentation
    } catch (error) {
      console.error('Error submitting query:', error);
      setApiResponse(`Error: ${error.message}`);
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
  }, [apiResponse]);

  // Adjust height for the input textarea
  const adjustInputTextareaHeight = () => {
    if (inputTextareaRef.current) {
      inputTextareaRef.current.style.height = 'auto';
      inputTextareaRef.current.style.height = `${inputTextareaRef.current.scrollHeight}px`;
    }
  };

  // Adjust input textarea height whenever inputText changes
  useEffect(() => {
    adjustInputTextareaHeight();
  }, [inputText]);

  return (
    <div className="text-submit-page" style={{ width: '100%' }}>
      <h2>Sparql Query to send</h2>

      {/* Text input area */}
      <textarea
          ref={inputTextareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your query here"
          rows={1}
          style={{ overflow: 'hidden' }}
        />
      
      <button onClick={handleSubmit}>Send query</button>

      {/* Display API Response */}
      <div className="api-response">
        <h3>Jena Fuseki API Response</h3>
        <textarea readOnly
            ref={responseTextareaRef}
            value={apiResponse}
            style={{ overflow: 'hidden' }}
         />
      </div>

      {/* Back button */}
      <button onClick={() => navigate('/')}>Back to Weather Page</button>
    </div>

  );
}

export default TextSubmitPage;
