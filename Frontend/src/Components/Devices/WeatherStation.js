import React, { useState, useEffect } from 'react';

import mqtt from 'mqtt';

const MQTT_BROKER_URL = 'wss:9560e98a5b614e8cb8e275293952641a.s1.eu.hivemq.cloud:8884/mqtt';  // WebSocket URL for the MQTT broker

function WeatherStation() {
    const [weatherData, setWeatherData] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');

    useEffect(() => {
        const options = {
            clientId: "3",
            username: "Jakub",
            password: "QWaszx12",
            connectTimeout: 5000,
            reconnectPeriod: 1000, // Automatically try to reconnect every 1000ms
            clean: true // Depending on your requirement, you might want to set this to false
        };
        const client = mqtt.connect(MQTT_BROKER_URL, options);

        client.on('connect', () => {

            console.log("Connected to MQTT Broker via WebSockets!");
            setConnectionStatus('Connected.');
            client.subscribe('weather/data');
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

    // Define a function to get the appropriate style based on the connection status
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
            <h1>Weather Station Data</h1>
            <div style={{...styles.statusLine}}>Client Connection Status:
                <span style={{ ...getConnectionStyle(connectionStatus), marginLeft: '20px' }}>
                {connectionStatus}
              </span>

            </div>
            <table>
                <thead>
                <tr>
                    <th>Air Temperature (°C)</th>
                    <th>Road Temperature (°C)</th>
                    <th>Air Humidity (%)</th>
                    <th>Battery Level (V)</th>
                    <th>Timestamp</th>
                </tr>
                </thead>
                <tbody>
                {weatherData.map((data, index) => (

                    <tr key={index}>
                        <td>{data.AirTemperature.toFixed(2)}</td>
                        <td>{data.RoadTemperature.toFixed(2)}</td>
                        <td>{data.AirHumidity.toFixed(2)}</td>
                        <td>{data.BatteryLevel.toFixed(2)}</td>
                        <td>{new Date(data.Timestamp).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default WeatherStation;
// Define styles as objects directly
const styles = {
    statusConnected: {
        color: 'green',
    },
    statusDisconnected: {
        color: 'red',
    },
    statusLine: { // Adding a new style for the entire line
        fontWeight: 'bold'
    },
    // Add other styles as needed

};
