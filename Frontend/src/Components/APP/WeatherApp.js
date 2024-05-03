/*
// WeatherApp.js
import React, { useState } from 'react';

import WeatherPrediction from "../Prediction/WeatherPrediction";
import WeatherStation from "../Devices/WeatherStation";


function WeatherApp() {
    const [weatherData, setWeatherData] = useState([]);

    return (
        <div>
            <WeatherStation setWeatherData={setWeatherData} />
            <WeatherPrediction weatherData={weatherData} />
        </div>
    );
}

export default WeatherApp;
*/
import React, { useState } from 'react';
import WeatherStation from "../Devices/WeatherStation";
import WeatherPrediction from "../Prediction/WeatherPrediction";


function WeatherApp() {
    const [weatherData, setWeatherData] = useState([]);

    // Get the last entry's road temperature, if available
    const actualTemperature = weatherData.length > 0 ? weatherData[weatherData.length - 1].RoadTemperature : 0;

    return (
        <div>
            <WeatherStation setWeatherData={setWeatherData} />
            <WeatherPrediction weatherData={weatherData} actualTemperature={actualTemperature} />
        </div>
    );
}

export default WeatherApp;
