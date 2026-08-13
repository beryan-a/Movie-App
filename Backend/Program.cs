using Backend.logic;
using Backend.models;

var builder = WebApplication.CreateBuilder(args);

// CORS ayarı
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 1. DataLoader ile var olan CSV verilerini yüklüyoruz
DataLoader.loadMainData("data/main_data.csv");
DataLoader.loadMovies("data/movies.csv");

// 2. Senin RecommendationEngine sınıfından bir instance oluşturuyoruz
var engine = new RecommendationEngine(
    DataLoader.getMainUsers(),
    DataLoader.getMovieTitles(),
    DataLoader.getMovieIdColumns()
);

// Kullanıcı oylarını bellekte tutan dictionary
var userRatingsDb = new Dictionary<int, Dictionary<int, double>>();

// --- ENDPOINT 1: Film Oylama ---
app.MapPost("/api/ratings", (MovieRatingDto dto) =>
{
    if (!userRatingsDb.ContainsKey(dto.UserId))
    {
        userRatingsDb[dto.UserId] = new Dictionary<int, double>();
    }

    userRatingsDb[dto.UserId][dto.MovieId] = dto.Score;

    return Results.Ok(new { message = "Rating saved successfully" });
});

// --- ENDPOINT 2: Öneri Getirme ---
app.MapGet("/api/recommendations/{userId}", (int userId, int? X, int? K) =>
{
    if (!userRatingsDb.TryGetValue(userId, out var targetRatings) || targetRatings.Count == 0)
    {
        return Results.Ok(new List<string>());
    }

    int topUsersCount = X ?? 5;
    int topMoviesCount = K ?? 3;

    List<string> recommendations = engine.getRecommendations(targetRatings, topUsersCount, topMoviesCount);

    return Results.Ok(recommendations);
});

app.Run();