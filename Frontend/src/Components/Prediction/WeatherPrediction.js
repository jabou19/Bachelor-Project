import React, { useState } from 'react';
import axios from 'axios';

function WeatherPrediction() {
    const [inputs, setInputs] = useState({
        airTemperature: '',
        airHumidity: '',
        precipitation: '',
        time:'',
        createdAt:'',
    });
    const [prediction, setPrediction] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const apiUrl = 'http://localhost:5099/Predict';
        const data = {
            airTemperature: parseFloat(inputs.airTemperature),
            airHumidity: parseFloat(inputs.airHumidity),
            precipitation: parseFloat(inputs.precipitation),
            time: inputs.time,
            createdAt: inputs.createdAt,
        };

        const response = await axios.post(apiUrl, data, { headers: { 'Content-Type': 'application/json' }});
        console.log("Received Data:", response.data);
        setPrediction(response.data);

    };

    return (
        <div>
            <h1>Predict Road Conditions</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Air Temperature:
                    <input type="number" name="airTemperature" value={inputs.airTemperature} onChange={handleChange} />
                </label>
                <label>
                    Air Humidity:
                    <input type="number" name="airHumidity" value={inputs.airHumidity} onChange={handleChange} />
                </label>
                <label>
                    Precipitation:
                    <input type="number" name="precipitation" value={inputs.precipitation} onChange={handleChange} />
                </label>
                {/*type="datetime-local"*/}
                <label>
                    Time
                    <input type="text" name="time" value={inputs.time} onChange={handleChange} placeholder="YYYY-MM-DD HH:MM:SS" />
                </label>
                <label>
                    Created At
                    <input type="text" name="createdAt" value={inputs.createdAt} onChange={handleChange} placeholder="YYYY-MM-DD HH:MM:SS" />
                </label>

                <button type="submit">Predict</button>
            </form>
            {prediction &&   (
                <div>
                    <h2>Prediction Results:</h2>
                    {/*<p>Road Temperature: {prediction.roadTemperature.toFixed(2)}</p>
                    <p>Air Temperature: {prediction.airTemperature.toFixed(2)}</p>
                    <p>Air Humidity: {prediction.airHumidity.toFixed(2)}</p>
                    <p>Precipitation: {prediction.precipitation.toFixed(2)}</p>
                    <p> Time: {prediction.time}</p>
                    <p> CreatedAt: {prediction.createdAt}</p>*/}
                    <p>Predicted RoadTemperature Score: {prediction.score.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
}

export default WeatherPrediction;
