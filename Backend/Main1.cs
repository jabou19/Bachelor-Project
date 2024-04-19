using Backend.Backend.Communication_Layer;

namespace Backend;

public class Main1
{
    static async Task Main(string[] args)
    {
        var Publisher = new MqttClientPublisher();
        await Publisher.ConnectAndPublishAsync();
        var subscriber = new MqttClientSubscriber();
       await subscriber.ConnectAndSubscribeAsync();

        Console.WriteLine("Press any key to exit...");
        Console.ReadLine();

       // await subscriber.StopAsync();
        //await Publisher.StopAsync();

    }

}