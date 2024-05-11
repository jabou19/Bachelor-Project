/*
// Weather_WRSenseApp.js
import React, { useState } from 'react';

import Weather_WRSensePrediction from "../Prediction/Weather_WRSensePrediction";
import WeatherStation_WRSense from "../Devices/WeatherStation_WRSense";


function Weather_WRSenseApp() {
    const [weatherData, setWeatherData] = useState([]);

    return (
        <div>
            <WeatherStation_WRSense setWeatherData={setWeatherData} />
            <Weather_WRSensePrediction weatherData={weatherData} />
        </div>
    );
}

export default Weather_WRSenseApp;
*/
import React, { useState } from 'react';
import WeatherStation_WRSense from "../Devices/WeatherStation_WRSense";
import Weather_WRSensePrediction from "../Prediction/Weather_WRSensePrediction";


function Weather_WRSenseApp() {
    const [weatherData, setWeatherData] = useState([]);

    // Get the last entry's road temperature, if available
    const actualTemperature = weatherData.length > 0 ? weatherData[weatherData.length - 1].RoadTemperature : 0;

    return (
        <div>
            <WeatherStation_WRSense setWeatherData={setWeatherData} />
            <Weather_WRSensePrediction weatherData={weatherData} actualTemperature={actualTemperature} />
        </div>
    );
}

export default Weather_WRSenseApp;
