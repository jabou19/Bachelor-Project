import React, { Component } from 'react';
import axios from 'axios';
import { styles } from "../Styles/Stylesheet";

class BaseSensorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectionStatus: 'Connecting...',
            latestData: null,
            prediction: null,
            temperatureDifference: '',
            result: '',
            rSquared: null,
            showTable: false,
        };
        this.prevPrediction = React.createRef();
    }

    componentDidMount() {
        this.fetchRSquared();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.sensorData !== this.props.sensorData && this.props.sensorData.length > 0) {
            const latestData = this.props.sensorData[this.props.sensorData.length - 1];
            this.setState({ latestData }, () => {
                this.predict({
                    ...latestData,
                });
            });
        }
    }

    getConnectionStyle(status) {
        switch (status) {
            case 'Connected.':
                return styles.statusConnected;
            case 'Disconnected.':
            case 'Offline.':
            case 'Connection failed.':
                return styles.statusDisconnected;
            default:
                return {}; // default style if needed
        }
    }

    async fetchRSquared() {
        try {
            const response = await axios.get(this.props.rSquaredUrl);
            this.setState({ rSquared: response.data.rSquared });
        } catch (error) {
            console.error('Error fetching R-squared:', error);
        }
    }

    async predict(data) {
        try {
            const response = await axios.post(this.props.predictUrl, data, {
                headers: { 'Content-Type': 'application/json' },
            });
            this.setState({ prediction: response.data });
            this.detectErrorsViaPrediction(response.data.score, this.props.actualValue);
            this.prevPrediction.current = response.data;
        } catch (error) {
            console.error('Error making prediction:', error);
        }
    }

    detectErrorsViaPrediction(predicted, actual) {
        const difference = Math.abs(predicted - actual);
        this.setState({
            temperatureDifference: difference.toFixed(2),
            result: difference > 0.5 ? 'Error' : 'Correct',
        });
    }
}

export default BaseSensorComponent;
