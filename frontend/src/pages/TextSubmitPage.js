import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TextSubmitPage.css';

function TextSubmitPage() {
  const [inputText, setInputText] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const navigate = useNavigate();
  const responseTextareaRef = useRef(null);

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

  return (
    <div className="text-submit-page" style={{ width: '100%' }}>
      <h2>Sparql Query to send</h2>

      {/* Text input area */}
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="SELECT ?s ?o ?p FROM<http://example.org/dataset> WHERE{ ?s ?o ?p} LIMIT 3"
        rows={5}
      />
      
      <button onClick={handleSubmit}>Send query</button>

      {/* Display API Response */}
      <div className="api-response">
        <h3>Jena Fuseki API Response</h3>
        <textarea readOnly value={apiResponse} rows={10} />
      </div>

      {/* Back button */}
      <button onClick={() => navigate('/')}>Back to Weather Page</button>
    </div>

  );
}

export default TextSubmitPage;
