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
