
import React, { Component } from 'react';
import PersonCounter from "../Devices/PersonCounter";
import PersonCounterPrediction from "../Prediction/PersonCounteprediction";


class PersonCounterAPP extends Component {
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
        const actualValue = sensorData.length > 0 ? sensorData[sensorData.length - 1].PersonCount : 0;

        return (
            <div>
                <PersonCounter setSensorData={this.setSensorData} />
                <PersonCounterPrediction
                    sensorData={sensorData}
                    actualValue={actualValue}
                    rSquaredUrl="http://localhost:5000/evaluate-person"
                    predictUrl="http://localhost:5000/predict-person"
                    differenceThreshold={1.0} // Set the threshold for person count prediction
                    storageKey="PersonCounterAPP" // Key for session storage
                />
            </div>
        );
    }
}

export default PersonCounterAPP;
