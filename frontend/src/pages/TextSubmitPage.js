import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TextSubmitPage.css';

function TextSubmitPage() {
  const [inputText, setInputText] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const navigate = useNavigate();

  // Handle API call with user input
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost/sparql/customQuery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputText })
      });

      if (!response.ok) {
        throw new Error('Failed to submit text');
      }

      const data = await response.json();
      setApiResponse(data.result || 'No result returned');
    } catch (error) {
      console.error('Error submitting text:', error);
      setApiResponse(`Error: ${error.message}`);
    }
  };

  return (
    <div className="text-submit-page">
      <h2>Submit Text to API</h2>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter your text here"
        rows={5}
        cols={50}
      />
      <button onClick={handleSubmit}>Submit Text</button>

      {/* Display API Response */}
      <div className="api-response">
        <h3>API Response</h3>
        <textarea readOnly value={apiResponse} rows={10} cols={50} />
      </div>

      {/* Button to return to main page */}
      <button onClick={() => navigate('/')}>Back to Weather Page</button>
    </div>
  );
}

export default TextSubmitPage;
