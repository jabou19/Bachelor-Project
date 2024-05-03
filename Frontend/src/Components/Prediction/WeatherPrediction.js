/*

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { styles } from "../Styles/Stylesheet";

function WeatherPrediction({ weatherData }) {
    const [inputs, setInputs] = useState({
        airTemperature: '',
        airHumidity: '',
        precipitation: '',
        time: '',
        createdAt: '',
    });
    const [prediction, setPrediction] = useState(null);
    const prevPrediction = useRef();  // useRef to hold the previous prediction value
    const [isPredictionChanged, setIsPredictionChanged] = useState(false); // State to track if prediction has changed
    const [rSquared, setRSquared] = useState(null);


    const fetchRSquared = async () => {
        try {
            const response = await axios.get('http://localhost:5000/evaluate-model');
            setRSquared(response.data.rSquared);
        } catch (error) {
            console.error('Error fetching R-squared:', error);
        }
    };

    useEffect(() => {
        fetchRSquared();
    }, []);
    useEffect(() => {

        if (weatherData.length > 0) {
            const latestData = weatherData[weatherData.length - 1];
            setInputs({
                airTemperature: latestData.AirTemperature.toFixed(2),
                airHumidity: latestData.AirHumidity.toFixed(2),
                precipitation: latestData.Precipitation,
                time: new Date(latestData.Time).toISOString().slice(0, 19).replace('T', ' '),
                createdAt: new Date(latestData.CreatedAt).toISOString().slice(0, 19).replace('T', ' ')
            });
            predictWeather({
                airTemperature: latestData.AirTemperature,
                airHumidity: latestData.AirHumidity,
                precipitation: latestData.Precipitation,
                time: latestData.Time,
                createdAt: latestData.CreatedAt,
            });
        }
    }, [weatherData]);

    const predictWeather = async (data) => {
        const apiUrl = 'http://localhost:5000/predict';
        try {
            const response = await axios.post(apiUrl, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (!prevPrediction.current || prevPrediction.current.score.toFixed(5) !== response.data.score.toFixed(5)) {
                setIsPredictionChanged(true);  // Set the flag when prediction changes
                setTimeout(() => setIsPredictionChanged(false), 3000);  // Reset after 3 seconds
            }
            setPrediction(response.data);
            prevPrediction.current = response.data; // Update the reference to the current prediction
        } catch (error) {
            console.error('Error making prediction:', error);
        }
    };

    const predictionResultStyle = {
        color: isPredictionChanged ? 'red' : 'black', // Change text color if prediction is updated
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', padding: 20 }}>
                <div>
                    <h2>Best model:</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        <strong>RSquared:</strong> {rSquared ? rSquared.toFixed(4) : 'Loading...'}
                        <strong>Model: </strong>{'FastForestRegression'}
                    </div>
                    <h2>Try your model</h2>
                    <h3>Input Data</h3>
                    <form>
                        <label style={styles.label}>Air Temperature (°C):</label>
                        <input style={styles.input} type="text" readOnly value={inputs.airTemperature} />

                        <label style={styles.label}>Air Humidity (%):</label>
                        <input style={styles.input} type="text" readOnly value={inputs.airHumidity} />

                        <label style={styles.label}>Precipitation (mm):</label>
                        <input style={styles.input} type="text" readOnly value={inputs.precipitation} />

                        <label style={styles.label}>Time:</label>
                        <input style={styles.input} type="text" readOnly value={inputs.time} />

                        <label style={styles.label}>Created At:</label>
                        <input style={styles.input} type="text" readOnly value={inputs.createdAt} />
                    </form>
                </div>
                <div style={{ width: '50%' }}>
                    {prediction && (
                        <div>
                            <h3>Prediction Results:</h3>
                            <p style={predictionResultStyle}>{`Road Temperature: ${prediction.score.toFixed(5)}`}</p>
                            {/!* Add other predictions as necessary *!/}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WeatherPrediction;
*/
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { styles } from "../Styles/Stylesheet";

function WeatherPrediction({ weatherData, actualTemperature }) {
    const [inputs, setInputs] = useState({
        airTemperature: '',
        airHumidity: '',
        precipitation: '',
        time: '',
        createdAt: '',
    });
    const [prediction, setPrediction] = useState(null);
    const [temperatureDifference, setTemperatureDifference] = useState('');
    const [result, setResult] = useState('');
    const [rSquared, setRSquared] = useState(null);
    const prevPrediction = useRef();

    const fetchRSquared = async () => {
        try {
            const response = await axios.get('http://localhost:5000/evaluate-model');
            setRSquared(response.data.rSquared);
        } catch (error) {
            console.error('Error fetching R-squared:', error);
        }
    };

    useEffect(() => {
        fetchRSquared();
    }, []);

    useEffect(() => {
        if (weatherData.length > 0) {
            const latestData = weatherData[weatherData.length - 1];
            setInputs({
                airTemperature: latestData.AirTemperature.toFixed(2),
                airHumidity: latestData.AirHumidity.toFixed(2),
                precipitation: latestData.Precipitation,
                time: new Date(latestData.Time).toISOString().slice(0, 19).replace('T', ' '),
                createdAt: new Date(latestData.CreatedAt).toISOString().slice(0, 19).replace('T', ' ')
            });
            predictWeather({
                airTemperature: latestData.AirTemperature,
                airHumidity: latestData.AirHumidity,
                precipitation: latestData.Precipitation,
                time: latestData.Time,
                createdAt: latestData.CreatedAt,
            });
        }
    }, [weatherData]);

    const predictWeather = async (data) => {
        const apiUrl = 'http://localhost:5000/predict';
        try {
            const response = await axios.post(apiUrl, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            setPrediction(response.data);
            calculateDifference(response.data.score, actualTemperature);
            prevPrediction.current = response.data;
        } catch (error) {
            console.error('Error making prediction:', error);
        }
    };

    const calculateDifference = (predicted, actual) => {
        const difference = Math.abs(predicted - actual);
        setTemperatureDifference(difference.toFixed(2));
        setResult(difference > 0.5 ? 'Error' : 'Correct');
    };

    // Style for the result based on whether it is correct or an error
    const resultStyle = {
        fontWeight: 'bold',
        color: result === 'Correct' ? 'green' : 'red'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', padding: 20 }}>
            <div>
                <h2>Best model:</h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start',marginBottom:5 }}>
                    <strong>RSquared: {rSquared ? rSquared.toFixed(4) : 'Loading...'}</strong>
                    <p>"R-Squared - The closer to 1.00, the better quality"</p>
                    {'How close the actual data values are to the predicted value'}
                    <strong>Model: </strong>{'FastForestRegression'}
                </div>
                <h2>Try your model</h2>
                <form>
                    <label style={styles.label}>Air Temperature (°C):</label>
                    <input style={styles.input} type="text" readOnly value={inputs.airTemperature} />
                    <label style={styles.label}>Air Humidity (%):</label>
                    <input style={styles.input} type="text" readOnly value={inputs.airHumidity} />
                    <label style={styles.label}>Precipitation (mm):</label>
                    <input style={styles.input} type="text" readOnly value={inputs.precipitation} />
                    <label style={styles.label}>Time:</label>
                    <input style={styles.input} type="text" readOnly value={inputs.time} />
                    <label style={styles.label}>Created At:</label>
                    <input style={styles.input} type="text" readOnly value={inputs.createdAt} />
                </form>
            </div>
            <div style={{ width: '50%' }}>
                {prediction && (
                    <div>
                        <h3>Prediction Results:</h3>
                        <p>Predicted Road Temperature: {prediction.score.toFixed(2)}°C</p>
                        <p>Actual Road Temperature: {actualTemperature.toFixed(2)}°C</p>
                        <p>Difference Between Predicted and Actual Road Temperature:  </p>
                        <p style={resultStyle}>{temperatureDifference}°C - {result}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeatherPrediction;
