using Backend.models;
using System.IO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Backend.logic;

public class DataLoader
{
    private static List<userNode> mainUsers = new List<userNode>();
    private static Dictionary<int, string> movieTitles = new Dictionary<int, string>();
    private static int[] movieIdColumns = new int[0];

    // GETTER'LAR
    public static List<userNode> getMainUsers() => mainUsers;
    public static Dictionary<int, string> getMovieTitles() => movieTitles;
    public static int[] getMovieIdColumns() => movieIdColumns;

    // main_data.csv file için
    public static List<userNode> loadMainData(string filePath)
    {
        mainUsers = new List<userNode>();

        using (StreamReader sr = new StreamReader(filePath))
        {
            string headerLine = sr.ReadLine();

            if (headerLine == null)
            {
                return mainUsers;
            }

            string[] headers = headerLine.Split(',');
            movieIdColumns = new int[headers.Length - 1];

            for (int i = 1; i < headers.Length; i++)
            {
                string t = headers[i].Trim();
                movieIdColumns[i - 1] = string.IsNullOrEmpty(t) ? 0 : int.Parse(t);
            }

            string line;
            while ((line = sr.ReadLine()) != null)
            {
                line = line.Trim();
                if (string.IsNullOrEmpty(line)) continue;

                string[] parts = line.Split(',');
                int userId = int.Parse(parts[0].Trim());

                Dictionary<int, double> ratingMap = new Dictionary<int, double>();

                for (int i = 1; i < parts.Length && (i - 1) < movieIdColumns.Length; i++)
                {
                    string val = parts[i].Trim();
                    double r = string.IsNullOrEmpty(val) ? 0.0 : double.Parse(val, System.Globalization.CultureInfo.InvariantCulture);

                    if (r != 0.0)
                    {
                        ratingMap[movieIdColumns[i - 1]] = r;
                    }
                }

                mainUsers.Add(new userNode(userId, ratingMap));
            }
        }
        return mainUsers;
    }

    // movies.csv file için
    public static Dictionary<int, string> loadMovies(string filePath)
    {
        movieTitles = new Dictionary<int, string>();

        using (StreamReader sr = new StreamReader(filePath))
        {
            sr.ReadLine();
            string line;
            int skipped = 0;
            while ((line = sr.ReadLine()) != null)
            {
                line = line.Trim();
                if (string.IsNullOrEmpty(line)) continue;

                string[] parts = SplitCsvLine(line);

                if (parts.Length < 2)
                {
                    skipped++;
                    continue;
                }

                try
                {
                    int movieId = int.Parse(parts[0].Trim());
                    string title = parts[1].Trim().Replace("\"", "");
                    movieTitles[movieId] = title;
                }
                catch (Exception)
                {
                    skipped++;
                }
            }
            Console.WriteLine("Skipped rows: " + skipped);
        }
        return movieTitles;
    }

    public static List<userNode> LoadTargetUsers(string filePath)
    {
        return loadMainData(filePath);
    }

    public static int[] ParseMovieIdsFromHeader(string filePath)
    {
        using (StreamReader sr = new StreamReader(filePath))
        {
            string header = sr.ReadLine();
            if (header == null) return new int[0];

            string[] parts = header.Split(',');
            int[] ids = new int[parts.Length - 1];

            for (int i = 1; i < parts.Length; i++)
            {
                string t = parts[i].Trim();
                ids[i - 1] = string.IsNullOrEmpty(t) ? 0 : int.Parse(t);
            }
            return ids;
        }
    }

    private static string[] SplitCsvLine(string line)
    {
        List<string> result = new List<string>();
        StringBuilder sb = new StringBuilder();
        bool inQuotes = false;

        foreach (char c in line)
        {
            if (c == '"')
            {
                inQuotes = !inQuotes;
            }
            else if (c == ',' && !inQuotes)
            {
                result.Add(sb.ToString());
                sb.Clear();
            }
            else
            {
                sb.Append(c);
            }
        }

        result.Add(sb.ToString());
        return result.ToArray();
    }

    //write new user on csv file(probably main_data.csv)
    public static userNode RegisterNewUserInCsv(string filePath, int newUserId)
    {
        int movieCount = movieIdColumns.Length;

        StringBuilder sb = new StringBuilder();
        sb.Append(newUserId);
        for(int i=0; i<movieCount; i++)
        {
            sb.Append(",0"); // at beginning all movies does not rated so 0
        }

        using(StreamWriter sw = new StreamWriter(filePath, append: true))
        {
            sw.WriteLine(sb.ToString());
        }

        var newUserNode = new userNode(newUserId, new Dictionary<int, double>());
        mainUsers.Add(newUserNode);

        return newUserNode;
    }

    // 2. Oy Verme (Rate Movie) -> Kullanıcının hafızadaki oylarını günceller
    public static void SaveUserRatingInMemoryAndCsv(string filePath, int userId, int movieId, double score)
    {
        // Hafızadaki kullanıcıyı bul ve oyunu güncelle
        var targetUser = mainUsers.FirstOrDefault(u => u.getUserId() == userId);
        if (targetUser != null)
        {
            targetUser.getRatings()[movieId] = score;
        }

        // NOT: CSV dosyasının tamamını sürekli baştan yazmak yerine 
        // sunucu kapatılırken veya periyodik olarak CSV'ye kaydetmek çok daha performanslıdır.
        // Ama anlık yazmak istersen dosyayı güncel verilerle baştan yazabilirsin:
        SaveAllUsersToCsv(filePath);
    }

    public static void SaveAllUsersToCsv(string filePath)
    {
        using (StreamWriter sw = new StreamWriter(filePath, append: false))
        {
            // Header satırını yaz
            sw.Write("user_id");
            foreach (int colId in movieIdColumns)
            {
                sw.Write("," + colId);
            }
            sw.WriteLine();

            // Tüm kullanıcıları yaz
            foreach (var user in mainUsers)
            {
                sw.Write(user.getUserId());
                var userRatings = user.getRatings();

                foreach (int colId in movieIdColumns)
                {
                    double rating = userRatings.GetValueOrDefault(colId, 0.0);
                    sw.Write("," + rating.ToString(System.Globalization.CultureInfo.InvariantCulture));
                }
                sw.WriteLine();
            }
        }
    }
}