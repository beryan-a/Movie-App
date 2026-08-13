namespace Backend.models
{
    //gelen/giden istekler ve rating mantığı için DTO ve Entity modelleri
    public class Rating
    {
        public int UserId { get; set; }
        public int MovieId { get; set; }
        public double Score { get; set; } // 1.0 ile 5.0 arası
    }

    public class MovieRatingDto
    {
        public int UserId { get; set; }
        public int MovieId { get; set; }
        public double Score { get; set; }
    }
}