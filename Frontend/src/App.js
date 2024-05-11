
import './App.css';
import Home from "./Components/Home";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Components/Navbar";
import Weather_WRSenseApp from "./Components/APP/Weather_WRSenseApp";
import WaterLevelApp from "./Components/APP/WaterLevelApp";
import PersonCounterAPP from "./Components/APP/PersonCounterAPP";
import Weather_WSenseApp from "./Components/APP/Weather_WSenseAPP";
function App() {
  return (
      <Router>
          <Navbar />
          <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/weatherstation_wrsense" element={< Weather_WRSenseApp  />} />
              <Route path="/weatherstation_wsense" element={< Weather_WSenseApp  />} />
              <Route path="/waterlevel" element={< WaterLevelApp/>} />
              <Route path="/personcounter" element={< PersonCounterAPP/>} />
          </Routes>
      </Router>

  );
}

export default App;
