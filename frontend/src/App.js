import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WeatherPage from './pages/WeatherPage';
import TextSubmitPage from './pages/TextSubmitPage';
import StatisticsPage from './pages/StatisticsPage';
//import Diagramm from './components/diagramm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherPage />} />
        <Route path="/text-submit" element={<TextSubmitPage />} />
        <Route path="/Statistics" element={<StatisticsPage/>}/>


        {/*<Route path="/diagramm" element={<Diagramm/>}/>*/}
        
      </Routes>
    </Router>
  );
}

export default App;
