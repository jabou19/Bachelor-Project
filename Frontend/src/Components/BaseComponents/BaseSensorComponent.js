
import React, { Component } from 'react';
import axios from 'axios';
import { styles } from "../Styles/Stylesheet";

class BaseSensorComponent extends Component {
    constructor(props) {
        super(props);

        // Retrieve stored data or set initial state
        const storedData = sessionStorage.getItem(this.props.storageKey);
        const initialState = storedData ? JSON.parse(storedData) : {
            connectionStatus: 'Connecting...',
            latestData: null,
            prediction: null,
            temperatureDifference: '',
            result: '',
            rSquared: null,
            showTable: false,
            correctCount: 0,
            incorrectCount: 0,
            totalPredictions: 0,
        };

        this.state = initialState;
        this.prevPrediction = React.createRef();
    }

    componentDidMount() {
        this.fetchRSquared();
    }

    componentDidUpdate(prevProps, prevState) {
        // Save state to sessionStorage
        sessionStorage.setItem(this.props.storageKey, JSON.stringify(this.state));

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
        const threshold = this.props.differenceThreshold;
        const isCorrect = difference <= threshold;

        this.setState((prevState) => ({
            temperatureDifference: difference.toFixed(2),
            result: isCorrect ? 'Correct' : 'Error',
            totalPredictions: prevState.totalPredictions + 1,
            correctCount: isCorrect ? prevState.correctCount + 1 : prevState.correctCount,
            incorrectCount: isCorrect ? prevState.incorrectCount : prevState.incorrectCount + 1,
        }));
    }

    getCorrectPercentage() {
        const { totalPredictions, correctCount } = this.state;
        return totalPredictions === 0 ? 0 : ((correctCount / totalPredictions) * 100).toFixed(2);
    }

    getIncorrectPercentage() {
        const { totalPredictions, incorrectCount } = this.state;
        return totalPredictions === 0 ? 0 : ((incorrectCount / totalPredictions) * 100).toFixed(2);
    }
}

export default BaseSensorComponent;
