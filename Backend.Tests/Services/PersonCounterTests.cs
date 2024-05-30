using System;
using System.IO;
using Backend.Backend.Services;
using Newtonsoft.Json.Linq;
using Xunit;

namespace PersonCounterTests
{
    public class PersonCounterTests
    {
        [Fact]
        public void ReadingData_FileDoesNotExist_ThrowsFileNotFoundException()
        {
            // Arrange
            var personCounter = new PersonCounter();
            var invalidFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, personCounter.FilePath);
            if (File.Exists(invalidFilePath))
            {
                File.Delete(invalidFilePath); // Ensure the file does not exist
            }

            // Act & Assert
            Xunit.Assert.Throws<FileNotFoundException>(() => personCounter.ReadingData());
        }

        [Fact]
        public void ReadingData_EmptyJsonArray_ThrowsException()
        {
            // Arrange
            var personCounter = new PersonCounter();
            var fullFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, personCounter.FilePath);

            // Create a JSON file with an empty array
            File.WriteAllText(fullFilePath, "[]");

            // Act & Assert
            var exception = Xunit.Assert.Throws<Exception>(() => personCounter.ReadingData());
            Xunit.Assert.Equal("JSON array is empty.", exception.Message);
        }

        [Fact]
        public void ReadingData_ValidJsonFile_UpdatesProperties()
        {
            // Arrange
            var personCounter = new PersonCounter();
            var fullFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, personCounter.FilePath);

            // Create a JSON file with valid data
            var jsonArray = new JArray(
                new JObject(
                    new JProperty("personCount", 10),
                    new JProperty("batteryLevel", 75.5),
                    new JProperty("time", new DateTime(2023, 5, 1)),
                    new JProperty("createdAt", new DateTime(2023, 5, 1))
                )
            );
            File.WriteAllText(fullFilePath, jsonArray.ToString());

            // Act
            personCounter.ReadingData();

            // Assert
            Xunit.Assert.Equal(10, personCounter.PersonCount);
            Xunit.Assert.Equal(75.5, personCounter.BatteryLevel);
            Xunit.Assert.Equal(new DateTime(2023, 5, 1), personCounter.Time);
            Xunit.Assert.Equal(new DateTime(2023, 5, 1), personCounter.CreatedAt);
        }

        [Fact]
        public void ReadingData_SequentialReadings_UpdatesIndexCorrectly()
        {
            // Arrange
            var personCounter = new PersonCounter();
            var fullFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, personCounter.FilePath);

            // Create a JSON file with multiple entries
            var jsonArray = new JArray(
                new JObject(
                    new JProperty("personCount", 10),
                    new JProperty("batteryLevel", 75.5),
                    new JProperty("time", new DateTime(2023, 5, 1)),
                    new JProperty("createdAt", new DateTime(2023, 5, 1))
                ),
                new JObject(
                    new JProperty("personCount", 15),
                    new JProperty("batteryLevel", 80.0),
                    new JProperty("time", new DateTime(2023, 5, 2)),
                    new JProperty("createdAt", new DateTime(2023, 5, 2))
                )
            );
            File.WriteAllText(fullFilePath, jsonArray.ToString());

            // Act
            personCounter.ReadingData();
            personCounter.ReadingData();

            // Assert
            Xunit.Assert.Equal(15, personCounter.PersonCount);
            Xunit.Assert.Equal(80.0, personCounter.BatteryLevel);
            Xunit.Assert.Equal(new DateTime(2023, 5, 2), personCounter.Time);
            Xunit.Assert.Equal(new DateTime(2023, 5, 2), personCounter.CreatedAt);
            Xunit.Assert.Equal(0, personCounter.CurrentIndex); // Index should wrap around
        }
    }
}
