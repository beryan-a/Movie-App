using Backend.models;
using System.IO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace Backend.logic;

public class DataLoader
{
    private static List<userNode> mainUsers = new List<userNode>();
    private static Dictionary<int, string> movieTitles = new Dictionary<int, string>(); //movieId, movieTitles
    private static int[] movieIdColumns = new int[0];
    private static List<UserAccount> usersList = new List<UserAccount>();
    public static List<userNode> getMainUsers() => mainUsers;
    public static Dictionary<int, string> getMovieTitles() => movieTitles;
    public static int[] getMovieIdColumns() => movieIdColumns;
    public static List<UserAccount> getUsersList() => usersList;
    public static List<userNode> loadMainData(string filePath)
    {
        mainUsers = new List<userNode>();
        if (!File.Exists(filePath)) return mainUsers;

        using (StreamReader sr = new StreamReader(filePath))
        {
            string headerLine = sr.ReadLine();
            
            if (headerLine == null) return mainUsers;

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

    public static Dictionary<int, string> loadMovies(string filePath)
    {
        movieTitles = new Dictionary<int, string>();
        if (!File.Exists(filePath)) return movieTitles;

        using (StreamReader sr = new StreamReader(filePath))
        {
            sr.ReadLine(); // Header
            string line;
            while ((line = sr.ReadLine()) != null)
            {
                line = line.Trim();
                if (string.IsNullOrEmpty(line)) continue;

                string[] parts = SplitCsvLine(line);
                if (parts.Length < 2) continue;

                try
                {
                    int movieId = int.Parse(parts[0].Trim());
                    string title = parts[1].Trim().Replace("\"", "");
                    movieTitles[movieId] = title;
                }
                catch { }
            }
        }
        return movieTitles;
    }

    public static List<UserAccount> LoadUsers(string filePath)
    {
        usersList = new List<UserAccount>();
        if (!File.Exists(filePath)) return usersList;

        using (StreamReader sr = new StreamReader(filePath))
        {
            sr.ReadLine(); // Header
            string line;
            while ((line = sr.ReadLine()) != null)
            {
                if (string.IsNullOrWhiteSpace(line)) continue;
                string[] parts = line.Split(',');
                if (parts.Length >= 3)
                {
                    usersList.Add(new UserAccount
                    {
                        UserId = int.Parse(parts[0].Trim()),
                        Username = parts[1].Trim(),
                        Password = parts[2].Trim()
                    });
                }
            }
        }
        return usersList;
    }

    public static UserAccount RegisterUser(string usersPath, string mainDataPath, string username, string password)
    {
        int newUserId = usersList.Count > 0 
            ? usersList.Max(u => u.UserId) + 1 
            : (mainUsers.Count > 0 ? mainUsers.Max(u => u.getUserId()) + 1 : 1);

        var newUser = new UserAccount { UserId = newUserId, Username = username, Password = password };
        usersList.Add(newUser);

        // 1. users.csv'ye yaz
        using (StreamWriter sw = new StreamWriter(usersPath, append: true))
        {
            sw.WriteLine($"{newUserId},{username},{password}");
        }

        // 2. main_data.csv'ye 0 puanlarla ekle
        int movieCount = movieIdColumns.Length;
        StringBuilder sb = new StringBuilder();
        sb.Append(newUserId);
        for (int i = 0; i < movieCount; i++) sb.Append(",0");

        using (StreamWriter sw = new StreamWriter(mainDataPath, append: true))
        {
            sw.WriteLine(sb.ToString());
        }

        mainUsers.Add(new userNode(newUserId, new Dictionary<int, double>()));
        return newUser;
    }

    public static void SaveUserRatingInMemoryAndCsv(string filePath, int userId, int movieId, double score)
    {
        var targetUser = mainUsers.FirstOrDefault(u => u.getUserId() == userId);
        if (targetUser == null)
        {
            targetUser = new userNode(userId, new Dictionary<int, double>());
            mainUsers.Add(targetUser);
        }
        
        targetUser.getRatings()[movieId] = score;
        SaveAllUsersToCsv(filePath);
    }

    public static void SaveAllUsersToCsv(string filePath)
    {
        using (StreamWriter sw = new StreamWriter(filePath, append: false))
        {
            sw.Write("user_id");
            foreach (int colId in movieIdColumns) sw.Write("," + colId);
            sw.WriteLine();

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

    public static List<string> GetUserFavorites(string filePath, int userId)
    {
        var favs = new List<string>();
        if (!File.Exists(filePath)) return favs;

        using (StreamReader sr = new StreamReader(filePath))
        {
            sr.ReadLine();
            string line;
            while ((line = sr.ReadLine()) != null)
            {
                if (string.IsNullOrWhiteSpace(line)) continue;
                string[] parts = line.Split(',');
                if (parts.Length >= 2 && int.Parse(parts[0].Trim()) == userId)
                {
                    favs.Add(parts[1].Trim().Replace("\"", ""));
                }
            }
        }
        return favs;
    }

    public static void ToggleFavoriteInCsv(string filePath, int userId, string movieTitle)
    {
        var allFavs = new List<Tuple<int, string>>();
        if (File.Exists(filePath))
        {
            using (StreamReader sr = new StreamReader(filePath))
            {
                sr.ReadLine();
                string line;
                while ((line = sr.ReadLine()) != null)
                {
                    if (string.IsNullOrWhiteSpace(line)) continue;
                    string[] parts = line.Split(',');
                    if (parts.Length >= 2)
                    {
                        allFavs.Add(new Tuple<int, string>(int.Parse(parts[0].Trim()), parts[1].Trim().Replace("\"", "")));
                    }
                }
            }
        }

        var existing = allFavs.FirstOrDefault(f => f.Item1 == userId && f.Item2.Equals(movieTitle, StringComparison.OrdinalIgnoreCase));
        if (existing != null)
        {
            allFavs.Remove(existing);
        }
        else
        {
            allFavs.Add(new Tuple<int, string>(userId, movieTitle));
        }

        using (StreamWriter sw = new StreamWriter(filePath, append: false))
        {
            sw.WriteLine("userId,movieTitle");
            foreach (var f in allFavs)
            {
                sw.WriteLine($"{f.Item1},\"{f.Item2}\"");
            }
        }
    }

    private static string[] SplitCsvLine(string line)
    {
        List<string> result = new List<string>();
        StringBuilder sb = new StringBuilder();
        bool inQuotes = false;
        foreach (char c in line)
        {
            if (c == '"') inQuotes = !inQuotes;
            else if (c == ',' && !inQuotes) { result.Add(sb.ToString()); sb.Clear(); }
            else sb.Append(c);
        }
        result.Add(sb.ToString());
        return result.ToArray();
    }

    private static string NormalizeTitle(string rawTitle)
    {
        if (string.IsNullOrWhiteSpace(rawTitle)) return string.Empty;

        string s = rawTitle.Replace("\"", "").Trim().ToLowerInvariant();
        s = System.Text.RegularExpressions.Regex.Replace(s, @"\s*\(\d{4}\)", "");
        s = System.Text.RegularExpressions.Regex.Replace(s, @",\s*(the|a|an)$", "");
        s = System.Text.RegularExpressions.Regex.Replace(s, @"^(the|a|an)\s+", "");
        s = System.Text.RegularExpressions.Regex.Replace(s, @"[^\w\s]", "");

        return s.Trim();
    }

    public static int GetOrCreateMovie(string title, string moviesFilePath, string mainDataFilePath)
    {
        string searchNorm = NormalizeTitle(title);

        foreach (var kvp in movieTitles)
        {
            string existingNorm = NormalizeTitle(kvp.Value);
            if (existingNorm == searchNorm)
            {
                return kvp.Key;
            }
        }

        foreach (var kvp in movieTitles)
        {
            string existingNorm = NormalizeTitle(kvp.Value);
            if (!string.IsNullOrEmpty(existingNorm) && !string.IsNullOrEmpty(searchNorm))
            {
                if (existingNorm.Contains(searchNorm) || searchNorm.Contains(existingNorm))
                {
                    return kvp.Key;
                }
            }
        }

        int newMovieId = movieTitles.Count > 0 ? movieTitles.Keys.Max() + 1 : 1;

        using (StreamWriter sw = new StreamWriter(moviesFilePath, append: true))
        {
            sw.WriteLine($"{newMovieId},\"{title}\"");
        }
        movieTitles[newMovieId] = title;

        var newColumns = movieIdColumns.ToList();
        newColumns.Add(newMovieId);
        movieIdColumns = newColumns.ToArray();

        SaveAllUsersToCsv(mainDataFilePath);
        return newMovieId;
    }
}