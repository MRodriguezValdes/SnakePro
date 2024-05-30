using WebApplication2.GameClasses.DataBase;
using WebApplication2.hubs;

// Create a new web application builder with the provided command-line arguments.
var builder = WebApplication.CreateBuilder(args);
// Add SignalR services to the container.
builder.Services.AddSignalR();
// Add CORS services to the container.
builder.Services.AddCors(options =>
{
    // Define a CORS policy named "AllowAngularApp".
    options.AddPolicy("AllowAngularApp",
        builder =>
        {
            // Allow requests from the specified origin, with any headers and methods, and allow credentials.
            builder.WithOrigins("http://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});
// Add API explorer services to the container, which are required for Swagger.
builder.Services.AddEndpointsApiExplorer();
// Add Swagger generator services to the container.
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IFirebaseDbConnection, FirebaseDbConnection>();


// Add controller services to the container.
builder.Services.AddControllers();
// Build the application.
var app = builder.Build();
// Enable middleware to serve generated Swagger as a JSON endpoint.
app.UseSwagger();
// Enable middleware to serve the Swagger UI, specifying the Swagger JSON endpoint.
app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1"); });
// Redirect HTTP requests to HTTPS.
app.UseHttpsRedirection();
// Use the "AllowAngularApp" CORS policy.
app.UseCors("AllowAngularApp");
// Map the SignalR hub to the specified path.
app.MapHub<SnakeGameHub>("/snakegamehub");
// Map attribute-routed controllers.
app.MapControllers();
// Run the application.
app.Run();