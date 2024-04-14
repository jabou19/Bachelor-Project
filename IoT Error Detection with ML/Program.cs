using HiveMQtt.Client;
using HiveMQtt.Client.Options;
using HiveMQtt.MQTT5.ReasonCodes;
using HiveMQtt.MQTT5.Types;
using System.Text.Json;


// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");


var options = new HiveMQClientOptions
{
    Host = "1fbf4d0f9bad4a64a7d043d315c30509.s1.eu.hivemq.cloud",
    Port = 8883,
    UseTLS = true,
    UserName = "Abdullahi",
    Password = "Birkeparken70"

};

var client = new HiveMQClient(options);

Console.WriteLine($"Connecting to {options.Host} on port {options.Port} ...");

// Connect
HiveMQtt.Client.Results.ConnectResult connectResult;

try
{
    connectResult = await client.ConnectAsync().ConfigureAwait(false);
    if (connectResult.ReasonCode == ConnAckReasonCode.Success) 
    {
        Console.WriteLine($"Connect successful: {connectResult}");
    }
    else
    {
        // Fixme: add toString
        Console.WriteLine($"Connect failed: {connectResult}");
        Environment.Exit(-1);
    }
}
catch (System.Net.Sockets.SocketException e)
{
    Console.WriteLine($"Error connecting to the MQTT Broker with the following socket error: {e.Message}");
    Environment.Exit(-1);
}
catch (Exception e)
{
    Console.WriteLine($"Error connecting to the MQTT Broker with the following socket error: {e.Message}");
    Environment.Exit(-1);
}

// message handler
client.OnMessageReceived += (sender, args) =>
{
    string received_message = args.PublishMessage.PayloadAsString;
    Console.WriteLine(received_message);
};

// Subscribe 
await client.SubscribeAsync("hivemqdemo/commands").ConfigureAwait(false);

// initialise telemetry values
double temperatur = 25.1;
double humidity = 88.5;
var rand = new Random();

Console.WriteLine("Publish message...");

while (true)
{

    double currentTemperatur = temperatur + rand.NextDouble();
    double currentHumidity = humidity + rand.NextDouble();

    var msg = JsonSerializer.Serialize(
        new
        {
            temperatur = currentTemperatur,
            humidity = currentHumidity,

        });

    // Publish MQTT messages
    var result = await client.PublishAsync("hivemqdemo/telemetry", msg, QualityOfService.AtLeastOnceDelivery).ConfigureAwait(false);

}
