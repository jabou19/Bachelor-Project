
import React, { Component } from 'react';
import WeatherStation_WSense from "../Devices/WeatherStation_WSense";
import Weather_WSensePrediction from "../Prediction/Weather_WSensePrediction";

class Weather_WSenseApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensorData: []
        };
    }

    setSensorData = (data) => {
        this.setState({ sensorData: data });
    }

    render() {
        const { sensorData } = this.state;
        const actualValue = sensorData.length > 0 ? sensorData[sensorData.length - 1].RoadTemperature : 0;

        return (
            <div>
                <WeatherStation_WSense setSensorData={this.setSensorData} />
                <Weather_WSensePrediction
                    sensorData={sensorData}
                    actualValue={actualValue}
                    rSquaredUrl="http://localhost:5000/evaluate-wsensor"
                    predictUrl="http://localhost:5000/predict-wsensor"
                    differenceThreshold={0.5} // Set the threshold for Weather_WSense prediction
                    storageKey="Weather_WSenseApp" // Key for session storage
                />
            </div>
        );
    }
}

export default Weather_WSenseApp;
