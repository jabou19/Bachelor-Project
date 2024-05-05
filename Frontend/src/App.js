
import './App.css';
import Home from "./Components/Home";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Components/Navbar";
import WeatherApp from "./Components/APP/WeatherApp";
import WaterLevelApp from "./Components/APP/WaterLevelApp";
import PersonCounterAPP from "./Components/APP/PersonCounterAPP";
function App() {
  return (
      <Router>
          <Navbar />
          <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/weatherstation" element={< WeatherApp  />} />
              <Route path="/waterlevel" element={< WaterLevelApp/>} />
              <Route path="/personcounter" element={< PersonCounterAPP/>} />
          </Routes>
      </Router>

  );
}

export default App;
