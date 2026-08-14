namespace Backend.models
{
    // users.csv dosyasındaki satırları temsil eden model
    public class UserAccount
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Frontend'den Login ve Signup isteklerinde gelen veri modeli
    public class AuthDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}