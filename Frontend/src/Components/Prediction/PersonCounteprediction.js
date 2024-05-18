import React from 'react';
import { styles } from "../Styles/Stylesheet";
import BaseSensorComponent from "../BaseComponents/BaseSensorComponent";

class PersonCounterPrediction extends BaseSensorComponent {
    detectErrorsViaPrediction(predicted, actual) {
        const difference = Math.abs(predicted - actual);
        const threshold = this.props.differenceThreshold;
        const isCorrect = difference <= threshold;

        this.setState((prevState) => ({
            temperatureDifference: difference.toFixed(0),
            result: isCorrect ? 'Correct' : 'Error',
            totalPredictions: prevState.totalPredictions + 1,
            correctCount: isCorrect ? prevState.correctCount + 1 : prevState.correctCount,
            incorrectCount: isCorrect ? prevState.incorrectCount : prevState.incorrectCount + 1,
        }));
    }

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
                        <label style={styles.label}>Battery Level (V):</label>
                        <input style={styles.input} type="text" readOnly value={latestData ? latestData.BatteryLevel.toFixed(2) : ''} />
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
                            <p>Predicted Person Count: {prediction.score.toFixed(0)}</p>
                            <p>Actual Person Count: {actualValue.toFixed(0)}</p>
                            <h4>Detect Errors via difference between Predicted and Actual Person Count:  </h4>
                            <p>If difference between Predicted and Actual PersonCount is more than <span style={{ color: 'blue', fontWeight: 'bold', fontSize: 18 }}>{threshold}</span> person,so it is Error. Otherwise, it is Correct:</p>
                            <p style={resultStyle}>{temperatureDifference} - {result}</p>
                            <p>Correct Predictions: {correctCount} ({correctPercentage}%)</p>
                            <p>Incorrect Predictions: {incorrectCount} ({incorrectPercentage}%)</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default PersonCounterPrediction;
