using Backend.logic;
using Backend.models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyOrigin()
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

// 1. CSV Verilerini Yüklüyoruz
DataLoader.loadMainData("data/main_data.csv");
DataLoader.loadMovies("data/movies.csv");


// --- 1. SIGNUP ENDPOINT ---
app.MapPost("/api/auth/signup", () =>
{
    int newUserId = Random.Shared.Next(10000, 99999);
    DataLoader.RegisterNewUserInCsv("data/main_data.csv", newUserId);
    return Results.Ok(new { userId = newUserId, message = "Kullanıcı başarıyla oluşturuldu!" });
});


// --- 2. RATING ENDPOINT (Film İsim/Yılı ile Oylama) ---
// --- RATING ENDPOINT ---
app.MapPost("/api/ratings", (MovieRatingByTitleDto dto) =>
{
    // Film varsa ID'sini alır, yoksa CSV'ye ve matrise yeni kolon olarak ekler
    int movieId = DataLoader.GetOrCreateMovie(dto.MovieTitle, "data/movies.csv", "data/main_data.csv");

    DataLoader.SaveUserRatingInMemoryAndCsv("data/main_data.csv", dto.UserId, movieId, dto.Score);

    return Results.Ok(new { message = "Rating başarıyla kaydedildi!", movieId = movieId });
});



// --- 3. RECOMMENDATIONS ENDPOINT ---
app.MapGet("/api/recommendations/{userId}", (int userId, int? X, int? K) =>
{
    var allUsers = DataLoader.getMainUsers();
    var targetUser = allUsers.FirstOrDefault(u => u.getUserId() == userId);

    if (targetUser == null || targetUser.getRatings().Count == 0)
    {
        return Results.Ok(new List<string>());
    }

    // Kullanıcının kendisi hariç diğer kullanıcılarla kıyaslama
    var otherUsers = allUsers.Where(u => u.getUserId() != userId).ToList();

    var customEngine = new RecommendationEngine(
        otherUsers,
        DataLoader.getMovieTitles(),
        DataLoader.getMovieIdColumns()
    );

    List<string> recommendations = customEngine.getRecommendations(
        targetUser.getRatings(),
        X ?? 5,
        K ?? 3
    );

    return Results.Ok(recommendations);
});

app.Run();

// DTO Sınıfı (Artık ID yerine Film Adı alıyor)
public class MovieRatingByTitleDto
{
    public int UserId { get; set; }
    public string MovieTitle { get; set; } = string.Empty; // Örn: "Toy Story (1995)"
    public double Score { get; set; }
}