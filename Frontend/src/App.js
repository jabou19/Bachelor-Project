
import './App.css';
import Home from "./Components/Home";
import WeatherStation from "./Components/Devices/WeatherStation";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Components/Navbar";
import WaterLevel from "./Components/Devices/WaterLevel";
import PersonCounter from "./Components/Devices/PersonCounter";
import WeatherPrediction from "./Components/Prediction/WeatherPrediction";
function App() {
  return (
      <Router>
          <Navbar />
          <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/weatherstation" element={< WeatherStation />} />
              <Route path="/waterlevel" element={< WaterLevel/>} />
              <Route path="/personcounter" element={< PersonCounter/>} />
              <Route path="/weatherstationprediction" element={< WeatherPrediction/>} />
          </Routes>
      </Router>

  );
}

export default App;
