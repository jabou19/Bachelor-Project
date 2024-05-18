
import React from 'react';
import { styles } from "../Styles/Stylesheet";
import BaseSensorComponent from "../BaseComponents/BaseSensorComponent";

class Weather_WRSensePrediction extends BaseSensorComponent {
    render() {
        const { latestData, prediction, temperatureDifference, result, rSquared, correctCount, incorrectCount, totalPredictions } = this.state;
        const { actualValue } = this.props;
        const threshold = this.props.differenceThreshold;

        const resultStyle = {
            fontWeight: 'bold',
            color: result === 'Correct' ? 'green' : 'red'
        };

        const correctPercentage = this.getCorrectPercentage();
        const incorrectPercentage = this.getIncorrectPercentage();

        return (
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', padding: 20 }}>
                <div>
                    <h2>Best model:</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 5 }}>
                        <strong>RSquared: {rSquared ? rSquared.toFixed(3) : 'Loading...'}</strong>
                        <p>"R-Squared - The closer to 1.00, the better quality"</p>
                        {'How close the actual data values are to the predicted value'}
                        <strong>Model: </strong>{'FastForestRegression'}
                    </div>
                    <h2>Try your model</h2>
                    <form>
                        <label style={styles.label}>Air Temperature (°C):</label>
                        <input style={styles.input} type="text" readOnly value={latestData ? latestData.AirTemperature.toFixed(2) : ''} />
                        <label style={styles.label}>Air Humidity (%):</label>
                        <input style={styles.input} type="text" readOnly value={latestData ? latestData.AirHumidity.toFixed(2) : ''} />
                        <label style={styles.label}>Precipitation (mm):</label>
                        <input style={styles.input} type="text" readOnly value={latestData ? latestData.Precipitation : ''} />
                        <label style={styles.label}>Time:</label>
                        <input style={styles.input} type="text" readOnly value={latestData ? new Date(latestData.Time).toISOString().slice(0, 19).replace('T', ' ') : ''} />
                        <label style={styles.label}>Created At:</label>
                        <input style={styles.input} type="text" readOnly value={latestData ? new Date(latestData.CreatedAt).toISOString().slice(0, 19).replace('T', ' ') : ''} />
                    </form>
                </div>
                <div style={{ width: '50%' }}>
                    {prediction && (
                        <div>
                            <h3>Prediction Results:</h3>
                            <p>Predicted Road Temperature: {prediction.score.toFixed(2)}°C</p>
                            <p>Actual Road Temperature: {actualValue.toFixed(2)}°C</p>
                            <h4>Detect Errors via difference between Predicted and Actual Road Temperature:  </h4>
                            <p>If difference between Predicted and Actual Road Temperature is more than <span style={{ color: 'blue', fontWeight: 'bold', fontSize: 15 }}>{threshold}</span> ,so it is Error. Otherwise, it is Correct:</p>
                            <p style={resultStyle}>{temperatureDifference}°C - {result}</p>
                            <p>Correct: {correctCount} ({correctPercentage}%)</p>
                            <p>Incorrect: {incorrectCount} ({incorrectPercentage}%)</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Weather_WRSensePrediction;
