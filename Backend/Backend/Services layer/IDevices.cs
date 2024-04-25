namespace Backend.Backend.Services_layer;

public interface IDevices
{
    public void GenerateRandomData();
    double? BatteryLevel { get; }
    DateTime? Time { get; }
    DateTime? CreatedAt { get; }
}