using Newtonsoft.Json.Linq;

namespace Backend.Backend.Services_layer;

public class WeatherStation_WRSense:IDevices 
{
    public double AirTemperature { get; set; }
    public double RoadTemperature { get; set; }
    public double AirHumidity { get; set; }
    public double? BatteryLevel { get;  set; }
    public double Precipitation { get; set; }
    public DateTime? Time { get;  set; }
    public DateTime? CreatedAt { get; set; }
    private readonly string FilePath = "Files/HistoricalData_JSONFiles/WeatherStations/cleaned_wrsense-timestamp.json";
    private int currentIndex = 0; // Field to keep track of the current index

    public WeatherStation_WRSense()
    {
        
        GenerateRandomData();
    }
  
    public void GenerateRandomData()
    {
        var fullFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, FilePath);
        if (!File.Exists(fullFilePath))
        {
            throw new FileNotFoundException($"The JSON file was not found at path: {FilePath}");
        }

        // Read the JSON file content
        string jsonContent = File.ReadAllText(fullFilePath);

        // Parse the JSON content as a JArray
        JArray jsonArray = JArray.Parse(jsonContent);
        //pick an entry from the JSON file sequentially from beginning to end
        if (jsonArray.Count == 0)
        {
            throw new Exception("JSON array is empty.");
        }

        JObject item = jsonArray[currentIndex] as JObject;
        RoadTemperature = item["roadTemperature"]?.Value<double>() ?? RoadTemperature;
        AirTemperature = item["airTemperature"]?.Value<double>() ?? AirTemperature;
        AirHumidity = item["airHumidity"]?.Value<double>() ?? AirHumidity;
         Precipitation= item["precipitation"]?.Value<double>() ?? Precipitation;
        BatteryLevel = item["batteryLevel"]?.Value<double>() ?? BatteryLevel;
        Time = item["time"]?.Value<DateTime>() ?? DateTime.MinValue;
        CreatedAt = item["createdAt"]?.Value<DateTime>() ?? DateTime.MinValue;
        currentIndex = (currentIndex + 1) % jsonArray.Count; // Increment and wrap the index
    }
}