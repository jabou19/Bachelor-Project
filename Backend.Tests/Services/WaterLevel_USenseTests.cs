using System;
using System.IO;
using Backend.Backend.Services;
using Xunit;

namespace Backend.Tests.Services
{
    public class WaterLevel_USenseTests : IDisposable
    {
        private const string ValidJson = @"
        [
            {
                'distance': 10.0,
                'waterLevel': 5.0,
                'batteryLevel': 75.0,
                'time': '2023-05-01T10:00:00Z',
                'createdAt': '2023-05-01T10:00:00Z'
            }
        ]";

        private const string EmptyJson = "[]";

        private const string MissingFileJson = "[]";

        private const string FilePath = "Files/HistoricalData_JSONFiles/WaterLevel/non_existent_file.json";

        public WaterLevel_USenseTests()
        {
            // Create an empty JSON file to simulate the missing file scenario
            _ = Directory.CreateDirectory(Path.GetDirectoryName(FilePath));
            File.WriteAllText(FilePath, MissingFileJson);
        }

        public void Dispose()
        {
            // Delete the JSON file after the test is finished
            if (File.Exists(FilePath))
            {
                File.Delete(FilePath);
            }
        }

        [Fact]
        public void Constructor_WithValidJsonContent_ShouldSetProperties()
        {
            // Arrange
            var waterLevelSensor = new WaterLevel_USense();
            File.WriteAllText(waterLevelSensor.FilePath, ValidJson);

            // Act
            waterLevelSensor.ReadingData();

            // Assert
            Xunit.Assert.Equal(10.0, waterLevelSensor.Distance);
            Xunit.Assert.Equal(5.0, waterLevelSensor.WaterLevel);
            Xunit.Assert.Equal(75.0, waterLevelSensor.BatteryLevel);
            Xunit.Assert.Equal(DateTime.Parse("2023-05-01T10:00:00Z").ToUniversalTime(), waterLevelSensor.Time?.ToUniversalTime());
            Xunit.Assert.Equal(DateTime.Parse("2023-05-01T10:00:00Z").ToUniversalTime(), waterLevelSensor.CreatedAt?.ToUniversalTime());
        }

        [Fact]
        public void Constructor_WithEmptyJsonArray_ShouldThrowException()
        {
            // Arrange
            var waterLevelSensor = new WaterLevel_USense();
            File.WriteAllText(waterLevelSensor.FilePath, EmptyJson);

            // Act & Assert
            var ex = Xunit.Assert.Throws<Exception>(() => waterLevelSensor.ReadingData());
            Xunit.Assert.Equal("JSON array is empty.", ex.Message);
        }
        
    }
}
