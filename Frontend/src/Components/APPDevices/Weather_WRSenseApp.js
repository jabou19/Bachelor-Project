
import React, { Component } from 'react';
import WeatherStation_WRSense from "../Devices/WeatherStation_WRSense";
import Weather_WRSensePrediction from "../Prediction/Weather_WRSensePrediction";

class Weather_WRSenseApp extends Component {
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
                <WeatherStation_WRSense setSensorData={this.setSensorData} />
                <Weather_WRSensePrediction
                    sensorData={sensorData}
                    actualValue={actualValue}
                    rSquaredUrl="http://localhost:5000/evaluate-wrsensor"
                    predictUrl="http://localhost:5000/predict-wrsensor"
                    differenceThreshold={0.3} // Set the threshold for Weather_WRSense prediction
                    storageKey="Weather_WRSenseApp" // Key for session storage
                />
            </div>
        );
    }
}

export default Weather_WRSenseApp;
