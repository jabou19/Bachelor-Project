
import React from 'react';

import { styles } from "../Styles/Stylesheet";
import BaseSensorComponent from "../BaseComponents/BaseSensorComponent";

class WaterLevelPrediction extends BaseSensorComponent {
    render() {
        const { latestData, prediction, temperatureDifference: Difference, result, rSquared } = this.state;
        const { actualValue } = this.props;

        const resultStyle = {
            fontWeight: 'bold',
            color: result === 'Correct' ? 'green' : 'red'
        };

        return (
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', padding: 20 }}>
                <div>
                    <h2>Best model:</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 5 }}>
                        <strong>RSquared: {rSquared ? rSquared.toFixed(4) : 'Loading...'}</strong>
                        <p>"R-Squared - The closer to 1.00, the better quality"</p>
                        {'How close the actual data values are to the predicted value'}
                        <strong>Model: </strong>{'FastForestRegression'}
                    </div>
                    <h2>Try your model</h2>
                    <form>
                        <label style={styles.label}>Distance (m):</label>
                        <input style={styles.input} type="text" readOnly value={latestData ? latestData.Distance.toFixed(2) : ''} />
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
                            <p>Predicted Water Level: {prediction.score} (m)</p>
                            <p>Actual Water Level: {actualValue.toFixed(2)} (m)</p>
                            <p>Difference Between Predicted and Actual Water Level:  </p>
                            <p style={resultStyle}>{Difference} (m) - {result}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default WaterLevelPrediction;
