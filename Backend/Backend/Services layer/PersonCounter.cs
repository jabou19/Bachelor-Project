using Newtonsoft.Json.Linq;

namespace Backend.Backend.Services_layer;

public class PersonCounter:IDevices
{
    public int PersonCount { get; set; }
    public double? BatteryLevel { get; set; }
    public DateTime? Time { get; set; }
    public DateTime? CreatedAt { get; set; }
    private readonly string FilePath = "Files/HistoricalData_JSONFiles/persorCounter/people-counter.json";
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
        PersonCount = item["personCount"]?.Value<int?>() ?? PersonCount;
        BatteryLevel = item["batteryLevel"]?.Value<double>() ?? BatteryLevel;
        Time = item["time"]?.Value<DateTime>() ?? DateTime.MinValue;
        CreatedAt = item["createdAt"]?.Value<DateTime>() ?? DateTime.MinValue;
        currentIndex = (currentIndex + 1) % jsonArray.Count; // Increment and wrap the index
     
    }
}