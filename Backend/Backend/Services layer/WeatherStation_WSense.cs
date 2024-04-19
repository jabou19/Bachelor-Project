namespace Backend.Backend.Services_layer;

public class WeatherStation_WSense:IDevices
{
    public double AirTemperature { get; set; }
    public double RoadTemperature { get; set; }
    public double AirHumidity { get; set; }
    public double BatteryLevel { get;  set; }
    public DateTime TimeStamp { get;  set; }

    private Random random = new Random();

    public WeatherStation_WSense()
    {
        //TimeStamp = DateTime.UtcNow;
       // GenerateRandomData();
    }
  
    public void GenerateRandomData()
    {
        // Using Math.Round to ensure the values have no more than 2 decimal places
        AirTemperature = Math.Round(random.Next(-70, 70) + random.NextDouble(), 1);
        RoadTemperature = Math.Round(random.Next(-70, 70) + random.NextDouble(), 1);
        AirHumidity = Math.Round(random.Next(0, 100) + random.NextDouble(), 1);
        BatteryLevel = Math.Round(random.Next(3, (int)7.4) + random.NextDouble(), 1);
        TimeStamp = DateTime.Now;
    }
}