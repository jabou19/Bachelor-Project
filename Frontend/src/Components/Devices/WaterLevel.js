import React, {useEffect, useState} from "react";
import mqtt from "mqtt";
import {styles} from "../Styles/Stylesheet";

function WaterLevel ({setWaterData}){
    const MQTT_BROKER_URL = 'wss:9560e98a5b614e8cb8e275293952641a.s1.eu.hivemq.cloud:8884/mqtt';

    const [waterData, setWaterDataLocal] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    const [showTable, setShowTable] = useState(false);  // State to control table visibility

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
            client.subscribe('water/data');
        });

        client.on('message', (topic, message) => {
            const data = JSON.parse(message.toString());
            console.log(data.Timestamp); // Check what the timestamp looks like
            const newData = [...waterData, data];
            setWaterDataLocal(newData);
            setWaterData(newData); // Update parent state
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
    }, [setWaterData]);
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
            <div style={styles.statusLine}>Client Connection Status:
                <span style={{ ...getConnectionStyle(connectionStatus), marginLeft: '20px' }}>
                    {connectionStatus}
                </span>
            </div>
            <button onClick={() => setShowTable(!showTable)}>
                {showTable ? 'Hide Water Level' : 'Show Water Level'}
            </button>
            {showTable && (
                <table style={styles.table}>
                    <thead style={styles.th}>
                    <tr>
                        <th>Distance (m) </th>
                        <th>WaterLevel(m)</th>
                        <th>Battery Level (V)</th>
                        <th>Time</th>
                        <th>CreatedAt</th>
                    </tr>
                    </thead>
                    <tbody style={styles.td}>
                    {waterData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.Distance.toFixed(2)}</td>
                            <td>{data.WaterLevel.toFixed(2)}</td>
                            <td>{data.BatteryLevel.toFixed(2)}</td>
                            <td>{new Date(data.Time).toLocaleString()}</td>
                            <td>{new Date(data.CreatedAt).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
export default WaterLevel;
