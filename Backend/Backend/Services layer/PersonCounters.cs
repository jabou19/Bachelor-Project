namespace Backend.Backend.Services_layer;

public class PersonCounters:IDevices
{
    public int personCount { get; set; }
    public double BatteryLevel { get; set; }
    public DateTime TimeStamp { get; set; }
    private Random random = new Random();
    public void GenerateRandomData()
    {
        personCount=random.Next(0, 150);
        BatteryLevel = Math.Round(random.Next(3, (int)7.4) + random.NextDouble(), 2);
        TimeStamp = DateTime.Now;
    }
}