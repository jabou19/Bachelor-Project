namespace Backend.Backend.Communication_Layer;

using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;
using System;
using System.Text;
using System.Threading.Tasks;

public class Subscriber
{
    private IMqttClient _client;
    private IMqttClientOptions _options;

    public async Task Connect()
    {
        var factory = new MqttFactory();
        _client = factory.CreateMqttClient();
        _options = new MqttClientOptionsBuilder()
            //.WithTcpServer("localhost", 1883) // MQTT broker address
            .WithClientId("2") // Use a unique client ID
            .WithTcpServer("9560e98a5b614e8cb8e275293952641a.s1.eu.hivemq.cloud", 8883) // Use your HiveMQ Cloud Cluster URL and port for MQTT
            .WithCredentials("Jakub", "QWaszx12") // Use your HiveMQ Cloud username and password
            .WithTls() // HiveMQ Cloud requires TLS
            .Build();
        _client.UseConnectedHandler(async e =>
        {
            Console.WriteLine("Subscribe: Connected to MQTT broker.");
            // Subscribe to topic
            await _client.SubscribeAsync(new MqttTopicFilterBuilder().WithTopic("weather/data").Build());
            Console.WriteLine("Subscribed to 'weather/data'");
        });

        _client.UseDisconnectedHandler(e =>
        {
            Console.WriteLine("Subscribe: Disconnected from MQTT broker.");
        });

        _client.UseApplicationMessageReceivedHandler(e =>
        {
            Console.WriteLine("Received message:");
            Console.WriteLine($"Topic: {e.ApplicationMessage.Topic}");
          //  Console.WriteLine($"Payload: {Encoding.UTF8.GetString(e.ApplicationMessage.Payload)}");
            //Console.WriteLine($"QoS: {e.ApplicationMessage.QualityOfServiceLevel}");
            //Console.WriteLine($"Retain: {e.ApplicationMessage.Retain}");
            ProcessReceivedMessage(Encoding.UTF8.GetString(e.ApplicationMessage.Payload));
        });

        await _client.ConnectAsync(_options, CancellationToken.None);
    }

    private void ProcessReceivedMessage(string messagePayload)
    {
        // Here you could add additional processing or logging
        Console.WriteLine("Processing received data...");
        Console.WriteLine(messagePayload);
    }

    public async Task StopAsync()
    {
        if (_client.IsConnected)
        {
            await _client.DisconnectAsync();
        }
    }
}
