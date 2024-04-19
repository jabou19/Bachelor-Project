using Backend.Backend.Services_layer;

namespace Backend.Backend.Communication_Layer;

using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;
using System;
using System.Text.Json;
using System.Threading.Tasks;

public class MqttClientPublisher
{
    private IMqttClient _client;
    private IMqttClientOptions _options;
    private System.Timers.Timer _timer;
    private IDevices WSense= new WeatherStation_WSense();
    private IDevices WRSense = new WeatherStation_WRSense();
    private IDevices personCount = new PersonCounters();
    
    public async Task ConnectAndPublishAsync()
    {
        var factory = new MqttFactory();
        _client = factory.CreateMqttClient();
        _options = new MqttClientOptionsBuilder()
            //.WithTcpServer("localhost", 1883)
            .WithClientId("1") // Use a unique client ID
            .WithTcpServer("9560e98a5b614e8cb8e275293952641a.s1.eu.hivemq.cloud", 8883) // Use your HiveMQ Cloud Cluster URL and port for MQTT
            .WithCredentials("Jakub", "QWaszx12") // Use your HiveMQ Cloud username and password
            .WithTls() // HiveMQ Cloud requires TLS
            .Build();

        await _client.ConnectAsync(_options, CancellationToken.None);

        // Setup the timer to trigger every 3 seconds
        _timer = new System.Timers.Timer(2000);
        _timer.Elapsed += async (sender, args) => await PublishDataAsync();
        _timer.Enabled = true;
    }

    private async Task PublishDataAsync()
    {
        // Generate data 
        ((WeatherStation_WSense)WSense).GenerateRandomData();
        // Serialize data for WSense
        var jsonData_WSense = JsonSerializer.Serialize((WeatherStation_WSense)WSense);
        var message_WSense = new MqttApplicationMessageBuilder()
            .WithTopic("weather/data")
            .WithPayload(jsonData_WSense)
            .WithExactlyOnceQoS()
            .WithRetainFlag()
            .Build();

        // Serialize data for WRSense
        ((WeatherStation_WRSense)WRSense).GenerateRandomData();
        var jsonData_WRSense = JsonSerializer.Serialize((WeatherStation_WRSense)WRSense);
        var message_WRSense = new MqttApplicationMessageBuilder()
            .WithTopic("WeatherStation_WRSense/data")
            .WithPayload(jsonData_WRSense)
            .WithExactlyOnceQoS()
            .WithRetainFlag()
            .Build();
        //Serialize data  Person Counter
        ((PersonCounters)personCount).GenerateRandomData();
        var jasonData_PersonCount = JsonSerializer.Serialize((PersonCounters)personCount);
        var message_PersonCount = new MqttApplicationMessageBuilder()
            .WithTopic("Person_Counter/data")
            .WithPayload(jasonData_PersonCount)
            .WithExactlyOnceQoS()
            .WithRetainFlag()
            .Build();
        if (_client.IsConnected)
        {
            //Publisher
            Console.WriteLine("Publisher: Connected to MQTT broker.");
            await _client.PublishAsync(message_WSense, CancellationToken.None);
            await _client.PublishAsync(message_WRSense, CancellationToken.None);
            await _client.PublishAsync(message_PersonCount, CancellationToken.None);
        }
        else
        {
            Console.WriteLine("Publisher is disconnected, attempting reconnect...");
            await _client.ConnectAsync(_options, CancellationToken.None);
        }
    }

    public async Task StopAsync()
    {
        _timer?.Stop();
        _timer?.Dispose();
        await _client.DisconnectAsync();
    }
}
