import React, {useEffect, useState} from "react";
import mqtt from "mqtt";
import {styles} from "../Styles/Stylesheet";

const MQTT_BROKER_URL = 'wss:9560e98a5b614e8cb8e275293952641a.s1.eu.hivemq.cloud:8884/mqtt';
function Connection(){
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');

    useEffect(() => {
        const options = {
            clientId: "3",
            username: "Jakub",
            password: "QWaszx12",
            clean: true
        };
        const client = mqtt.connect(MQTT_BROKER_URL, options);

        client.on('connect', () => {
            console.log("Connected to MQTT Broker via WebSockets!");
            setConnectionStatus('Connected.');
        });


        client.on('error', (error) => {
            console.error('Connection error:', error);
            setConnectionStatus('Connection failed.');
        });

        client.on('offline', () => {
            setConnectionStatus('Offline.');
        });

        client.on('close', () => {
            setConnectionStatus('Disconnected.');
        });

        return () => {
            client.end();
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
    return(
        <div style={styles.statusLine}>Client Connection Status:
            <span style={{ ...getConnectionStyle(connectionStatus), marginLeft: 10 }}>
                    {connectionStatus}
                </span>
        </div>
    )
}
export default Connection;
