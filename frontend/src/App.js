import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WeatherPage from './pages/WeatherPage';
import TextSubmitPage from './pages/TextSubmitPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherPage />} />
        <Route path="/text-submit" element={<TextSubmitPage />} />
      </Routes>
    </Router>
  );
}

export default App;
