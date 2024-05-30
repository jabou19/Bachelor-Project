using Newtonsoft.Json.Linq;

namespace Backend.Backend.Services;

public class WeatherStation_WRSense:Devices 
{ 
    public double RoadTemperature { get; set; }
    public double AirTemperature { get; set; }
    public double AirHumidity { get; set; }
    public double Precipitation { get; set; }
    public double? BatteryLevel { get;  set; }
    public DateTime? Time { get;  set; }
    public DateTime? CreatedAt { get; set; }
    public string FilePath { get;  }= "Files/HistoricalData_JSONFiles/WeatherStations/cleaned_wrsense-timestamp.json";
    public int CurrentIndex { get; private set; }= 0; // Field to keep track of the current index

    public WeatherStation_WRSense()
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

        JObject item = jsonArray[CurrentIndex] as JObject;

        RoadTemperature = item["roadTemperature"]?.Type != JTokenType.Null ? item["roadTemperature"].Value<double>() : 0;
        AirTemperature = item["airTemperature"]?.Type != JTokenType.Null ? item["airTemperature"].Value<double>() : 0;
        AirHumidity = item["airHumidity"]?.Type != JTokenType.Null ? item["airHumidity"].Value<double>() : 0;
        Precipitation = item["precipitation"]?.Type != JTokenType.Null ? item["precipitation"].Value<double>() : 0;
        BatteryLevel = item["batteryLevel"]?.Type != JTokenType.Null ? item["batteryLevel"].Value<double>() : null;
        Time = item["time"]?.Type != JTokenType.Null ? item["time"].Value<DateTime>() : null;
        CreatedAt = item["createdAt"]?.Type != JTokenType.Null ? item["createdAt"].Value<DateTime>() : null;

        CurrentIndex = (CurrentIndex + 1) % jsonArray.Count; // Increment and wrap the index
    }
}