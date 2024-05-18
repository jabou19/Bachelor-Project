
import React from 'react';
import mqtt from 'mqtt';
import { styles } from "../Styles/Stylesheet";
import BaseSensorComponent from "../BaseComponents/BaseSensorComponent";

const MQTT_BROKER_URL = 'wss:9560e98a5b614e8cb8e275293952641a.s1.eu.hivemq.cloud:8884/mqtt';

class WeatherStation_WSense extends BaseSensorComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            showTable: false, // Ensure showTable is initially false
        };
    }

    componentDidMount() {
        super.componentDidMount();
        const options = {
            clientId: "3",
            username: "Jakub",
            password: "QWaszx12",
            connectTimeout: 5000,
            reconnectPeriod: 1000,
            clean: true
        };
        this.client = mqtt.connect(MQTT_BROKER_URL, options);

        this.client.on('connect', () => {
            console.log("Connected to MQTT Broker via WebSockets!");
            this.setState({ connectionStatus: 'Connected.' });
            this.client.subscribe('weather/data');
        });

        this.client.on('message', (topic, message) => {
            const data = JSON.parse(message.toString());
            this.setState({ latestData: data });
            this.props.setSensorData([data]); // Update parent state with the latest data
        });

        this.client.on('error', (error) => {
            console.error('Connection error:', error);
            this.setState({ connectionStatus: 'Connection failed.' });
        });

        this.client.on('offline', () => {
            console.log('MQTT client offline');
            this.setState({ connectionStatus: 'Offline.' });
        });

        this.client.on('close', () => {
            console.log('Connection closed');
            this.setState({ connectionStatus: 'Disconnected.' });
        });
    }

    componentWillUnmount() {
        if (this.client) {
            this.client.end();
        }
    }

    render() {
        const { latestData, connectionStatus, showTable } = this.state;

        return (
            <div className="App">
                <div style={styles.statusLine}>Client Connection Status:
                    <span style={{ ...this.getConnectionStyle(connectionStatus), marginLeft: '20px' }}>
                        {connectionStatus}
                    </span>
                </div>
                <button onClick={() => this.setState({ showTable: !showTable })}>
                    {showTable ? 'Hide Weather Data' : 'Show Weather Data'}
                </button>
                {showTable && latestData && (
                    <table style={styles.table}>
                        <thead style={styles.th}>
                        <tr>
                            <th>Road Temperature (°C)</th>
                            <th>Air Temperature (°C)</th>
                            <th>Air Humidity (%)</th>
                            <th>Battery Level (V)</th>
                            <th>Time</th>
                            <th>Created At</th>
                        </tr>
                        </thead>
                        <tbody style={styles.td}>
                        <tr>
                            <td>{latestData.RoadTemperature.toFixed(2)}</td>
                            <td>{latestData.AirTemperature.toFixed(2)}</td>
                            <td>{latestData.AirHumidity.toFixed(2)}</td>
                            <td>{latestData.BatteryLevel.toFixed(2)}</td>
                            <td>{new Date(latestData.Time).toLocaleString()}</td>
                            <td>{new Date(latestData.CreatedAt).toLocaleString()}</td>
                        </tr>
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}

export default WeatherStation_WSense;
