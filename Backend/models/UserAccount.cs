namespace Backend.models
{
    // users.csv dosyasındaki satırları temsil eden model
    public class UserAccount
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Login ve Signup istekleri için DTO
    public class AuthDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Film Oylama (Rating) isteği için DTO
    public class MovieRatingByTitleDto
    {
        public int UserId { get; set; }
        public string MovieTitle { get; set; } = string.Empty;
        public double Score { get; set; }
    }

    // Favori ekleme/çıkarma isteği için DTO
    public class FavoriteDto
    {
        public int UserId { get; set; }
        public string MovieTitle { get; set; } = string.Empty;
    }
}