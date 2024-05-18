using Newtonsoft.Json.Linq;

namespace Backend.Backend.Services;

public class WaterLevel_USense:Devices
{
    public double Distance { get; set; }
    public double WaterLevel { get; set; }
    public double? BatteryLevel { get;  set; }
    public DateTime? Time { get;  set; }
    public DateTime? CreatedAt { get; set; }
    public string FilePath { get;  } = "Files/HistoricalData_JSONFiles/WaterLevel/cleaned-water-level.json";
    public int CurrentIndex { get; private set; }= 0; // Field to keep track of the current index
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
        JObject item = jsonArray[CurrentIndex] as JObject;
        Distance = item["distance"]?.Value<double>() ?? Distance;
        WaterLevel = item["waterLevel"]?.Value<double>() ?? WaterLevel;
        BatteryLevel = item["batteryLevel"]?.Value<double>() ?? BatteryLevel;
        Time = item["time"]?.Value<DateTime>() ?? DateTime.MinValue;
        CreatedAt = item["createdAt"]?.Value<DateTime>() ?? DateTime.MinValue;
        CurrentIndex = (CurrentIndex + 1) % jsonArray.Count; // Increment and wrap the index
    }
}

