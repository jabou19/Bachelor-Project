
using Microsoft.Extensions.ML;
using Microsoft.OpenApi.Models;
using Backend.Backend.Communication_Layer;
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
    await subscriber.ConnectAndSubscribeAsync();
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
/*app.MapPost("/predict", (MLModel.ModelInput input) =>
    {
        // Use the static Predict method from the MLModel class
        var result = MLModel.Predict(input);
        Console.WriteLine($"Predicted Road Temperature: {result.Score}");

        // Task.FromResult is used to wrap the result in a Task since the lambda is expected to be async
        return Results.Ok(result);
    })
    .WithName("Predict")
    .WithOpenApi();*/

// Use CORS policy
app.UseCors("AllowMyLocalhost");
app.Run();

