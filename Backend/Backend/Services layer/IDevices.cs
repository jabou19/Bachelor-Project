namespace Backend.Backend.Services_layer;

public interface IDevices
{
    public void ReadingData();
    double? BatteryLevel { get; }
    DateTime? Time { get; }
    DateTime? CreatedAt { get; }
}