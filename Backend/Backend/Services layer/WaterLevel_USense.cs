namespace Backend.Backend.Services_layer;

public class WaterLevel_USense:IDevices
{  
    public double waterLevel  { get; private set; }
    public double distance { get; private set; }
    public double BatteryLevel { get; private set; }
    public DateTime TimeStamp { get; private set; }
    private Random random = new Random();
    public void GenerateRandomData()
    {
        BatteryLevel = Math.Round(random.Next(3, (int)7.4) + random.NextDouble(), 2);
        TimeStamp = DateTime.Now;
    }
}