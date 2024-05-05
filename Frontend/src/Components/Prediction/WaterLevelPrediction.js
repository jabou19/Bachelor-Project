import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {styles} from "../Styles/Stylesheet";

function WaterLevelPrediction({ waterData, actualWaterLevel }) {
    const [inputs, setInputs] = useState({
        distance: '',
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
        if (waterData.length > 0) {
            const latestData = waterData[waterData.length - 1];
            setInputs({
                distance: latestData.Distance.toFixed(2),
                time: new Date(latestData.Time).toISOString().slice(0, 19).replace('T', ' '),
                createdAt: new Date(latestData.CreatedAt).toISOString().slice(0, 19).replace('T', ' ')
            });
            predictWeather({
                distance: latestData.Distance,
                time: latestData.Time,
                createdAt: latestData.CreatedAt,
            });
        }
    }, [waterData]);

    const predictWeather = async (data) => {
        const apiUrl = 'http://localhost:5000/predict';
        try {
            const response = await axios.post(apiUrl, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            setPrediction(response.data);
            calculateDifference(response.data.score, actualWaterLevel);
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
                    <label style={styles.label}>Distance (m):</label>
                    <input style={styles.input} type="text" readOnly value={inputs.distance} />
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
                        <p>Predicted Water Level: {prediction.score.toFixed(2)} (m)</p>
                        <p>Actual Water Level: {actualWaterLevel.toFixed(2)} (m)</p>
                        <p>Difference Between Predicted and Actual Water Level:  </p>
                        <p style={resultStyle}>{temperatureDifference} (m) - {result}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
export default WaterLevelPrediction;
