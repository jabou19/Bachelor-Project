using System;
using System.IO;
using Backend.Backend.Services;
using Xunit;

namespace Backend.Tests.Services
{
    public class WeatherStation_WSenseTests : IDisposable
    {
        private const string ValidJson = @"
        [
            {
                'roadTemperature': 15.0,
                'airTemperature': 20.0,
                'airHumidity': 50.0,
                'batteryLevel': 75.0,
                'time': '2023-05-01T10:00:00Z',
                'createdAt': '2023-05-01T10:00:00Z'
            }
        ]";

        private const string EmptyJson = "[]";

        private const string InvalidJson = @"
        [
            {
                'roadTemperature': 15.0,
                'airTemperature': null,
                'airHumidity': 50.0,
                'batteryLevel': 75.0,
                'time': '2023-05-01T10:00:00Z',
                'createdAt': '2023-05-01T10:00:00Z'
            }
        ]";

        private const string FilePath = "Files/HistoricalData_JSONFiles/WeatherStations/wsense-thermocable.json";

        public WeatherStation_WSenseTests()
        {
            Directory.CreateDirectory(Path.GetDirectoryName(FilePath));
        }

        public void Dispose()
        {
            if (File.Exists(FilePath))
            {
                File.Delete(FilePath);
            }
        }

        [Fact]
        public void Constructor_WithValidJsonContent_ShouldSetProperties()
        {
            // Arrange
            File.WriteAllText(FilePath, ValidJson);

            // Act
            var weatherStation = new WeatherStation_WSense();

            // Assert
            Xunit.Assert.Equal(15.0, weatherStation.RoadTemperature);
            Xunit.Assert.Equal(20.0, weatherStation.AirTemperature);
            Xunit.Assert.Equal(50.0, weatherStation.AirHumidity);
            Xunit.Assert.Equal(75.0, weatherStation.BatteryLevel);
            Xunit.Assert.Equal(DateTime.Parse("2023-05-01T10:00:00Z").ToUniversalTime(), weatherStation.Time?.ToUniversalTime());
            Xunit.Assert.Equal(DateTime.Parse("2023-05-01T10:00:00Z").ToUniversalTime(), weatherStation.CreatedAt?.ToUniversalTime());
        }

        [Fact]
        public void Constructor_WithEmptyJsonArray_ShouldThrowException()
        {
            // Arrange
            File.WriteAllText(FilePath, EmptyJson);

            // Act & Assert
            var ex = Xunit.Assert.Throws<Exception>(() => new WeatherStation_WSense());
            Xunit.Assert.Equal("JSON array is empty.", ex.Message);
        }

        [Fact]
        public void Constructor_WithMissingFile_ShouldThrowFileNotFoundException()
        {
            // Act & Assert
            var ex = Xunit.Assert.Throws<FileNotFoundException>(() => new WeatherStation_WSense());
            Xunit.Assert.Contains($"The JSON file was not found at path: {FilePath}", ex.Message);
        }

        [Fact]
        public void Constructor_WithInvalidJsonContent_ShouldHandleNullValues()
        {
            // Arrange
            File.WriteAllText(FilePath, InvalidJson);

            // Act
            var weatherStation = new WeatherStation_WSense();

            // Assert
            Xunit.Assert.Equal(15.0, weatherStation.RoadTemperature);
            Xunit.Assert.Equal(0, weatherStation.AirTemperature);  // Default value for double
            Xunit.Assert.Equal(50.0, weatherStation.AirHumidity);
            Xunit.Assert.Equal(75.0, weatherStation.BatteryLevel);
            Xunit.Assert.Equal(DateTime.Parse("2023-05-01T10:00:00Z").ToUniversalTime(), weatherStation.Time?.ToUniversalTime());
            Xunit.Assert.Equal(DateTime.Parse("2023-05-01T10:00:00Z").ToUniversalTime(), weatherStation.CreatedAt?.ToUniversalTime());
        }
    }
}
