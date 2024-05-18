
import React, { Component } from 'react';
import WaterLevel from "../Devices/WaterLevel";
import WaterLevelPrediction from "../Prediction/WaterLevelPrediction";

class WaterLevelApp extends Component {
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
                const actualValue = sensorData.length > 0 ? sensorData[sensorData.length - 1].WaterLevel : 0;

                return (
                    <div>
                            <WaterLevel setSensorData={this.setSensorData} />
                            <WaterLevelPrediction
                                sensorData={sensorData}
                                actualValue={actualValue}
                                rSquaredUrl="http://localhost:5000/evaluate-water"
                                predictUrl="http://localhost:5000/predict-water"
                                differenceThreshold={0.8} // Set the threshold for WaterLevel prediction
                                storageKey="WaterLevelApp" // Key for session storage
                            />
                    </div>
                );
        }
}

export default WaterLevelApp;
