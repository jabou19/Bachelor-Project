
using Microsoft.Extensions.ML;
using Microsoft.OpenApi.Models;
using Backend.Backend.Communication_Layer;
using Microsoft.ML;
using WaterLevelMLModel_Api;
using WeatherStationMLModel;
using WeatherStationWSenseMLModel_Api;


var builder = WebApplication.CreateBuilder(args);
// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyLocalhost",
        policy => policy.WithOrigins("http://localhost:3000") // Allow your frontend origin
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Register MQTT Publisher and Subscriber as Singleton
builder.Services.AddSingleton<Publisher>();
builder.Services.AddSingleton<Subscriber>();
// Register prediction engine
builder.Services.AddPredictionEnginePool<MLModel.ModelInput, MLModel.ModelOutput>()
    .FromFile("MLModel.mlnet");
builder.Services.AddPredictionEnginePool<WaterLevelMLModel.ModelInput, WaterLevelMLModel.ModelOutput>()
    .FromFile("WaterLevelMLModel.mlnet");
builder.Services.AddPredictionEnginePool<WeatherStationWSenseMLModel.ModelInput, WeatherStationWSenseMLModel.ModelOutput>()
    .FromFile("WeatherStationWSenseMLModel.mlnet");

// Add services to the container for OpenAPI/Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Description = "Docs for my API", Version = "v1" });
});

var app = builder.Build();

// Configure MQTT Clients
var publisher = app.Services.GetRequiredService<Publisher>();
var subscriber = app.Services.GetRequiredService<Subscriber>();

app.Lifetime.ApplicationStarted.Register(async () =>
{
    await publisher.Connect();
   // await subscriber.Connect();
});

app.Lifetime.ApplicationStopping.Register(async () =>
{
    await subscriber.StopAsync();
    await publisher.StopAsync();
});




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1"));
}

app.UseHttpsRedirection();

app.MapPost("/predict-road", async (PredictionEnginePool<MLModel.ModelInput, MLModel.ModelOutput> predictionEnginePool, MLModel.ModelInput input) =>
    {
        var result = predictionEnginePool.Predict(input);
        Console.WriteLine($"Predicted Road Temperature: {result.Score}");
        return await Task.FromResult(result);

    })
    .WithName("Predict")
    .WithOpenApi();
// Assuming the project root is the current directory if running directly from project
// For deployments, ensure this points to the root directory of the deployed files
builder.Host.UseContentRoot(Directory.GetCurrentDirectory());
app.MapGet("/evaluate-road", async () =>
    {
        var mlContext = new MLContext();

        // Load the model and training data
        // Relative paths from the repository root
        var modelPath = "MLModel.mlnet";
        var trainingDataPath = "Files/CVS/cleaned_wrsense.csv";
        IDataView trainingData = MLModel.LoadIDataViewFromFile(mlContext, trainingDataPath, ',', true);
        ITransformer model = mlContext.Model.Load(modelPath, out var schema);
        // Calculate R-squared on the training data
        double rSquared = MLModel.CalculateRSquaredOnTrainingData(mlContext, model, trainingData);
        Console.WriteLine($"R-squared on training data for Road Temperature: {rSquared}");
        // Return the R-squared value in the response
        return Results.Ok(new { RSquared = rSquared });
    })
    .WithName("EvaluateModel")
    .WithOpenApi();
// Define prediction route & handler
app.MapPost("/predict-wrsensor",
    async (PredictionEnginePool<WeatherStationWSenseMLModel.ModelInput, WeatherStationWSenseMLModel.ModelOutput> predictionEnginePool, WeatherStationWSenseMLModel.ModelInput input) =>
    {
        var result = predictionEnginePool.Predict(input);
        Console.WriteLine($"Predicted Road Temperature: {result.Score}");
        return await Task.FromResult(result);
    })
    .WithName("Predict WeatherStation_WSense")
    .WithOpenApi();

app.MapGet("/evaluate-wrsensor", async () =>
    {
        var mlContext = new MLContext();

        // Load the model and training data
        // Relative paths from the repository root
        var modelPath = "WeatherStationWSenseMLModel.mlnet";
        var trainingDataPath = "Files/CVS/wsense-thermocable.csv";
        IDataView trainingData = WeatherStationWSenseMLModel.LoadIDataViewFromFile(mlContext, trainingDataPath, ',', true);
        ITransformer model = mlContext.Model.Load(modelPath, out var schema);
        // Calculate R-squared on the training data
        double rSquared = WeatherStationWSenseMLModel.CalculateRSquaredOnTrainingWSenseData(mlContext, model, trainingData);
        Console.WriteLine($"R-squared on training data for Road Temperature: {rSquared}");
        // Return the R-squared value in the response
        return Results.Ok(new { RSquared = rSquared });
    })
    .WithName("EvaluateModel wrsensor")
    .WithOpenApi();

// Waterlevel Prediction Endpoint
app.MapPost("/predict-water", async (PredictionEnginePool<WaterLevelMLModel.ModelInput, WaterLevelMLModel.ModelOutput> predictionEnginePool, WaterLevelMLModel.ModelInput input) =>
    {
        var result = predictionEnginePool.Predict(input);
        Console.WriteLine($"Predicted Water Level Score: {result.Score}");
        return await Task.FromResult(result);
    })
    .WithName("Predict Water Level")
    .WithOpenApi();

// Endpoint to evaluate the model
app.MapGet("/evaluate-water", async () =>
    {
        var mlContext = new MLContext();

        // Load the model and training data
        var modelPath = "WaterLevelMLModel.mlnet";
        var trainingDataPath = "Files/CVS/WaterLevelFiltered.csv";
        IDataView trainingData = WaterLevelMLModel.LoadIDataViewFromFile(mlContext, trainingDataPath, ',', true);
        ITransformer model = mlContext.Model.Load(modelPath, out var schema);

        // Calculate R-squared on the training data
        double rSquared = WaterLevelMLModel.CalculateRSquaredOnTrainingDataWater(mlContext, model, trainingData);
        Console.WriteLine($"R-squared on training data for Water Level: {rSquared}");

        // Return the R-squared value
        return Results.Ok(new { RSquared = rSquared });
    })
    .WithName("EvaluateWater")
    .WithOpenApi();
// Apply CORS policy
// Use CORS policy
app.UseCors("AllowMyLocalhost");
app.Run();

