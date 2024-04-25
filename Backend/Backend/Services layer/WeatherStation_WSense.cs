

/*
using Newtonsoft.Json.Linq;

namespace Backend.Backend.Services_layer;

public class WeatherStation_WSense : IDevices
{
    public double AirTemperature { get; set; }
    public double RoadTemperature { get; set; }
    public double AirHumidity { get; set; }
    public double BatteryLevel { get; set; }
    public DateTime Time { get; set; }
    public DateTime CreatedAt { get; set; }

    private readonly string FilePath = "Files/HistoricalData_JSONFiles/WeatherStations/wsense-thermocable.json";
    private int currentIndex = 0; // Field to keep track of the current index

    public WeatherStation_WSense()
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
        AirTemperature = item["airTemperature"]?.Value<double>() ?? AirTemperature;
        RoadTemperature = item["roadTemperature"]?.Value<double>() ?? RoadTemperature;
        AirHumidity = item["airHumidity"]?.Value<double>() ?? AirHumidity;
        BatteryLevel = item["batteryLevel"]?.Value<double>() ?? BatteryLevel;
        Time = item["time"]?.Value<DateTime>() ?? DateTime.MinValue;
        CreatedAt = item["createdAt"]?.Value<DateTime>() ?? DateTime.MinValue;
        currentIndex = (currentIndex + 1) % jsonArray.Count; // Increment and wrap the index
    }
}
*/
using Newtonsoft.Json.Linq;
using System;
using System.IO;

namespace Backend.Backend.Services_layer;

public class WeatherStation_WSense : IDevices
{
    public double AirTemperature { get; set; }
    public double RoadTemperature { get; set; }
    public double AirHumidity { get; set; }
    public double? BatteryLevel { get; set; }
    public DateTime? Time { get; set; }
    public DateTime? CreatedAt { get; set; }

    private readonly string FilePath = "Files/HistoricalData_JSONFiles/WeatherStations/wsense-thermocable.json";
    private int currentIndex = 0;

    public WeatherStation_WSense()
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

        string jsonContent = File.ReadAllText(fullFilePath);
        JArray jsonArray = JArray.Parse(jsonContent);

        if (jsonArray.Count == 0)
        {
            throw new Exception("JSON array is empty.");
        }

        // Validate each object until a valid one is found or the array is exhausted
        while (currentIndex < jsonArray.Count)
        {
            JObject item = jsonArray[currentIndex] as JObject;
            if (IsObjectValid(item))
            {
                AirTemperature = item["airTemperature"].Value<double>();
                RoadTemperature = item["roadTemperature"].Value<double>();
                AirHumidity = item["airHumidity"].Value<double>();
                BatteryLevel = item["batteryLevel"].Value<double>();
                Time = item["time"].Value<DateTime>();
                CreatedAt = item["createdAt"].Value<DateTime>();
                break;  // Exit after processing a valid item
            }
            currentIndex++;
        }

        // Increment for next call or wrap around
        currentIndex = (currentIndex + 1) % jsonArray.Count;
    }

    private bool IsObjectValid(JObject item)
    {
        // Check if any of the necessary fields are null or missing
        return item != null &&
               item["airTemperature"] != null &&
               item["roadTemperature"] != null &&
               item["airHumidity"] != null &&
               item["batteryLevel"] != null &&
               item["time"] != null &&
               item["createdAt"] != null;
    }
}
