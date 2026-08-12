using Backend.models;
using Backend.logic;
namespace Backend;
public class Program
{
    public static void Main(string[] args)
    {
        // Metod içi yerel değişkenlerde 'private' KULLANILMAZ
        string dataDir = "data" + Path.DirectorySeparatorChar;

        // Dosya okuma işlemleri
        List<userNode> mainUsers = DataLoader.loadMainData(dataDir + "main_data.csv");
        List<userNode> targetUsers = DataLoader.LoadTargetUsers(dataDir + "target_user.csv");
        Dictionary<int, string> movieTitles = DataLoader.loadMovies(dataDir + "movies.csv");
        int[] movieIdColumns = DataLoader.ParseMovieIdsFromHeader(dataDir + "main_data.csv");

        // Java'daki keySet() yerine C#'ta .Keys.ToList() kullanılır
        List<int> sortedMovieIds = movieTitles.Keys.ToList();

        // Öneri motorunu başlatma
        RecommendationEngine engine = new RecommendationEngine(mainUsers, movieTitles, movieIdColumns);

        // System.out.println yerine Console.WriteLine ve .size() yerine .Count kullanılır
        Console.WriteLine("Total Movies: " + movieTitles.Count);
        Console.WriteLine("Target Users: " + targetUsers.Count);

        // --- TEST RUN: Örnek Öneri Alma ---
        if (targetUsers.Count > 0)
        {
            userNode firstTarget = targetUsers[0];
            // En benzer X=5 kullanıcıdan K=3'er film önerisi alalım
            List<string> recommendations = engine.getRecommendations(firstTarget.getRatings(), 5, 3);

            Console.WriteLine($"\nUser {firstTarget.getUserId()} için Önerilen Filmler:");
            foreach (var movie in recommendations)
            {
                Console.WriteLine("- " + movie);
            }
        }
    }
}
