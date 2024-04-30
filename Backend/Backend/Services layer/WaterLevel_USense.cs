using Newtonsoft.Json.Linq;

namespace Backend.Backend.Services_layer;

public class WaterLevel_USense:IDevices
{
    public double Distance { get; set; }
    public double WaterLevel { get; set; }
    public double? BatteryLevel { get;  set; }
    public DateTime? Time { get;  set; }
    public DateTime? CreatedAt { get; set; }
    private readonly string FilePath = "Files/HistoricalData_JSONFiles/WaterLevel/cleaned_water-level.json";
    private int currentIndex = 0; // Field to keep track of the current index
    public void ReadingData()
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
        Distance = item["distance"]?.Value<double>() ?? Distance;
        WaterLevel = item["waterLevel"]?.Value<double>() ?? WaterLevel;
        BatteryLevel = item["batteryLevel"]?.Value<double>() ?? BatteryLevel;
        Time = item["time"]?.Value<DateTime>() ?? DateTime.MinValue;
        CreatedAt = item["createdAt"]?.Value<DateTime>() ?? DateTime.MinValue;
        currentIndex = (currentIndex + 1) % jsonArray.Count; // Increment and wrap the index
    }
}
/*
using Newtonsoft.Json.Linq;

namespace Backend.Backend.Services_layer;

public class WaterLevel_USense : IDevices
{
    public double? WaterLevel { get; set; }
    public double? Distance { get; set; }
    public double? BatteryLevel { get; set; } // Also make BatteryLevel nullable
    public DateTime? Time { get; set; } // Make DateTime nullable
    public DateTime? CreatedAt { get; set; } // Make DateTime nullable

    private readonly string FilePath = "Files/HistoricalData_JSONFiles/WaterLevel/water-level.json";
    private int currentIndex = 0; // Field to keep track of the current index

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
        if (jsonArray.Count == 0)
        {
            throw new Exception("JSON array is empty.");
        }

        JObject item = jsonArray[currentIndex] as JObject;

        // Assign values using the nullable types with proper fallbacks
        Distance = item["distance"]?.Value<double?>();
        WaterLevel = item["waterLevel"]?.Value<double?>();
        BatteryLevel = item["batteryLevel"]?.Value<double?>();
        Time = item["time"]?.Value<DateTime?>();
        CreatedAt = item["createdAt"]?.Value<DateTime?>();

        currentIndex = (currentIndex + 1) % jsonArray.Count; // Increment and wrap the index
    }
}
*/
