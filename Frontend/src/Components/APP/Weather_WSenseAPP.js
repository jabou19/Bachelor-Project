import React, {useState} from "react";
import WeatherStation_WSense from "../Devices/WeatherStation_WSense";
import Weather_WSensePrediction from "../Prediction/Weather_WSensePrediction";

function Weather_WSenseApp() {
    const [weatherData, setWeatherData] = useState([]);

    // Get the last entry's road temperature, if available
    const actualTemperature = weatherData.length > 0 ? weatherData[weatherData.length - 1].RoadTemperature : 0;

    return (
        <div>
            <WeatherStation_WSense setWeatherData={setWeatherData} />
            <Weather_WSensePrediction weatherData={weatherData} actualTemperature={actualTemperature} />
        </div>
    );
}

export default Weather_WSenseApp;
