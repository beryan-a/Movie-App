namespace Backend.models
{
    // users.csv dosyasındaki satırları temsil eden model
    public class UserAccount
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Login ve Signup istekleri için veri tutar
    public class log_sign_requests
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Film Oylama (Rating) isteği için DTO(data transfer object)
    public class MovieRatingByTitleDto
    {
        public int UserId { get; set; }
        public string MovieTitle { get; set; } = string.Empty; // string.Empty (property initializer) özelliğinde class object ilk oluştuğunda bu özelliğe otomatik boş bir string atar. (nullable reference types) hatası almamak için
        public double Score { get; set; }
    }
    

    // Favori ekleme/çıkarma isteği için DTO
    public class FavoriteDto
    {
        public int UserId { get; set; }
        public string MovieTitle { get; set; } = string.Empty;
    }
}