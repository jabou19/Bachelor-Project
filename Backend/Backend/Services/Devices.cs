namespace Backend.Backend.Services;

public interface Devices
{
  
   public double? BatteryLevel { get; }
   public DateTime? Time { get; }
   public DateTime? CreatedAt { get; }
   public string FilePath { get; }
   public int CurrentIndex { get; }
   public void ReadingData();
}