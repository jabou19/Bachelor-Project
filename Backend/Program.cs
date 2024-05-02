
using Microsoft.Extensions.ML;
using Microsoft.OpenApi.Models;
using Backend.Backend.Communication_Layer;
using Microsoft.ML;
using MLModel_WebApi1;


var builder = WebApplication.CreateBuilder(args);
// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyLocalhost",
        policy => policy.WithOrigins("http://localhost:3000") // Allow your frontend origin
            .AllowAnyMethod()
            .AllowAnyHeader());
});
// Register prediction engine
builder.Services.AddPredictionEnginePool<MLModel.ModelInput, MLModel.ModelOutput>()
    .FromFile("MLModel.mlnet");

// Register MQTT Publisher and Subscriber as Singleton
builder.Services.AddSingleton<MqttClientPublisher>();
builder.Services.AddSingleton<MqttClientSubscriber>();

// Add services to the container for OpenAPI/Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Description = "Docs for my API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1"));
}

app.UseHttpsRedirection();

// Configure MQTT Clients
var publisher = app.Services.GetRequiredService<MqttClientPublisher>();
var subscriber = app.Services.GetRequiredService<MqttClientSubscriber>();

app.Lifetime.ApplicationStarted.Register(async () =>
{
    await publisher.ConnectAndPublishAsync();
    //await subscriber.ConnectAndSubscribeAsync();
});

app.Lifetime.ApplicationStopping.Register(async () =>
{
    await subscriber.StopAsync();
    await publisher.StopAsync();
});

app.MapPost("/predict", async (PredictionEnginePool<MLModel.ModelInput, MLModel.ModelOutput> predictionEnginePool, MLModel.ModelInput input) =>
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
app.MapGet("/evaluate-model", async () =>
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
        Console.WriteLine($"R-squared on training data: {rSquared}");
        // Return the R-squared value in the response
        return Results.Ok(new { RSquared = rSquared });
        
    })
    .WithName("EvaluateModel")
    .WithOpenApi();

// Use CORS policy
app.UseCors("AllowMyLocalhost");
app.Run();

