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

// 1. CSV Dosyalarını Yüklüyoruz
DataLoader.loadMovies("data/movies.csv");
DataLoader.loadMainData("data/main_data.csv");
DataLoader.LoadUsers("data/users.csv");

// ==========================================
// 1. AUTH ENDPOINTS (Signup & Login)
// ==========================================
app.MapPost("/api/auth/signup", (AuthDto dto) =>
{
    var users = DataLoader.getUsersList();
    if (users.Any(u => u.Username.Equals(dto.Username, StringComparison.OrdinalIgnoreCase)))
    {
        return Results.BadRequest(new { message = "Bu kullanıcı adı zaten alınmış!" });
    }

    var newUser = DataLoader.RegisterUser("data/users.csv", "data/main_data.csv", dto.Username, dto.Password);
    return Results.Ok(new { userId = newUser.UserId, username = newUser.Username, message = "Kayıt başarılı!" });
});

app.MapPost("/api/auth/login", (AuthDto dto) =>
{
    var users = DataLoader.getUsersList();
    var user = users.FirstOrDefault(u => u.Username.Equals(dto.Username, StringComparison.OrdinalIgnoreCase) && u.Password == dto.Password);

    if (user == null)
    {
        return Results.BadRequest(new { message = "Kullanıcı adı veya şifre hatalı!" });
    }

    return Results.Ok(new { userId = user.UserId, username = user.Username, message = "Giriş başarılı!" });
});

// ==========================================
// 2. RATING ENDPOINT
// ==========================================
app.MapPost("/api/ratings", (MovieRatingByTitleDto dto) =>
{
    if (string.IsNullOrWhiteSpace(dto.MovieTitle))
    {
        return Results.BadRequest(new { message = "Film adı boş olamaz!" });
    }

    int movieId = DataLoader.GetOrCreateMovie(dto.MovieTitle, "data/movies.csv", "data/main_data.csv");
    DataLoader.SaveUserRatingInMemoryAndCsv("data/main_data.csv", dto.UserId, movieId, dto.Score);

    return Results.Ok(new { message = "Rating başarıyla kaydedildi!", movieId = movieId });
});

// ==========================================
// 3. FAVORITES ENDPOINTS
// ==========================================
app.MapGet("/api/favorites/{userId}", (int userId) =>
{
    var favs = DataLoader.GetUserFavorites("data/favorites.csv", userId);
    return Results.Ok(favs);
});

app.MapPost("/api/favorites", (FavoriteDto dto) =>
{
    DataLoader.ToggleFavoriteInCsv("data/favorites.csv", dto.UserId, dto.MovieTitle);
    return Results.Ok(new { message = "Favori durumu güncellendi!" });
});

// ==========================================
// 4. RECOMMENDATIONS ENDPOINT
// ==========================================
app.MapGet("/api/recommendations/{userId}", (int userId, int? X, int? K) =>
{
    var allUsers = DataLoader.getMainUsers();
    var targetUser = allUsers.FirstOrDefault(u => u.getUserId() == userId);

    if (targetUser == null || targetUser.getRatings().Count == 0)
    {
        return Results.Ok(new List<string>());
    }

    // Hedef kullanıcı hariç diğer tüm kullanıcılar matrisi
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