
using Newtonsoft.Json.Linq;
using System;
using System.IO;

namespace Backend.Backend.Services;

public class WeatherStation_WSense : Devices
{ 
    public double RoadTemperature { get; set; }
    public double AirTemperature { get; set; }
    public double AirHumidity { get; set; }
    public double? BatteryLevel { get; set; }
    public DateTime? Time { get; set; }
    public DateTime? CreatedAt { get; set; }

    public string FilePath { get;  }= "Files/HistoricalData_JSONFiles/WeatherStations/wsense-thermocable.json";
    public int CurrentIndex { get; private set; }=  0;

    public WeatherStation_WSense()
    {
        ReadingData();
    }

    public void ReadingData()
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

        while (CurrentIndex < jsonArray.Count)
        {
            JObject item = jsonArray[CurrentIndex] as JObject;
            if (IsObjectValid(item))
            {
                RoadTemperature = item["roadTemperature"]?.Value<double?>() ?? default;
                AirTemperature = item["airTemperature"]?.Value<double?>() ?? default;
                AirHumidity = item["airHumidity"]?.Value<double?>() ?? default;
                BatteryLevel = item["batteryLevel"]?.Value<double?>();
                Time = item["time"]?.Value<DateTime?>();
                CreatedAt = item["createdAt"]?.Value<DateTime?>();
                break;
            }
            CurrentIndex++;
        }

        CurrentIndex = (CurrentIndex + 1) % jsonArray.Count;
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
