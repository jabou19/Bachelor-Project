
import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import {styles} from "../Styles/Stylesheet";
import WeatherPrediction from "../Prediction/WeatherPrediction";
const MQTT_BROKER_URL = 'wss:9560e98a5b614e8cb8e275293952641a.s1.eu.hivemq.cloud:8884/mqtt';

function WeatherStation() {
    const [weatherData, setWeatherData] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');

    useEffect(() => {
        const options = {
            clientId: "3",
            username: "Jakub",
            password: "QWaszx12",
            connectTimeout: 5000,
            reconnectPeriod: 1000,
            clean: true
        };
        const client = mqtt.connect(MQTT_BROKER_URL, options);

        client.on('connect', () => {
            console.log("Connected to MQTT Broker via WebSockets!");
            setConnectionStatus('Connected.');
            client.subscribe('station/data');
        });

        client.on('message', (topic, message) => {
            const data = JSON.parse(message.toString());
            console.log(data.Timestamp); // Check what the timestamp looks like
            setWeatherData(currentData => [...currentData, data]);
        });

        client.on('error', (error) => {
            console.error('Connection error:', error);
            setConnectionStatus('Connection failed.');
        });

        client.on('offline', () => {
            console.log('MQTT client offline');
            setConnectionStatus('Offline.');
        });

        client.on('close', () => {
            console.log('Connection closed');
            setConnectionStatus('Disconnected.');
        });

        return () => {
            if (client) {
                client.end();
            }
        };
    }, []);

    const getConnectionStyle = (status) => {
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
    };

    return (
        <div className="App">
            <h1>Weather Station (WRSense)</h1>
            <div style={styles.statusLine}>Client Connection Status:
                <span style={{ ...getConnectionStyle(connectionStatus), marginLeft: '20px' }}>
                    {connectionStatus}
                </span>
            </div>
            <WeatherPrediction></WeatherPrediction>
            <table style={styles.table}>
                <thead style={styles.th}>
                <tr>
                    <th>Road Temperature (°C)</th>
                    <th>Air Temperature (°C)</th>
                    <th>Air Humidity (%)</th>
                    <th>Precipitation (mm) </th>
                    <th>Battery Level (V)</th>
                    <th>Time</th>
                    <th>CreatedAt</th>
                </tr>
                </thead>
                <tbody style={styles.td}>
                {weatherData.map((data, index) => (
                    <tr key={index}>
                        <td>{data.RoadTemperature.toFixed(2)}</td>
                        <td>{data.AirTemperature.toFixed(2)}</td>
                        <td>{data.AirHumidity.toFixed(2)}</td>
                        <td>{data.Precipitation}</td>
                        <td>{data.BatteryLevel.toFixed(2)}</td>
                        <td>{new Date(data.Time).toLocaleString()}</td>
                        <td>{new Date(data.CreatedAt).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default WeatherStation;
