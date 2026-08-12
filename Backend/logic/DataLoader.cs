using Backend.models;
using System.IO;
using System;
using System.Collections.Generic;
using System.Text;


namespace Backend.logic;

public class DataLoader
{
    
    //main_data.csv file için
    public static List<userNode> loadMainData(string filePath){
        List<userNode> users = new List<userNode>();

        using(StreamReader sr = new StreamReader(filePath))
        {
            string headerLine = sr.ReadLine();

            if(headerLine == null) // dosya boşsa direkt boş list döndürecek
            {
                return users;
            }

            string[] headers = headerLine.Split(',');

            int[] movieIds = new int[headers.Length -1];

            for(int i=1; i<headers.Length; i++)
            {
                string t = headers[i].Trim();
                movieIds[i-1] = string.IsNullOrEmpty(t) ? 0: int.Parse(t);
            }

            string line;

            while((line = sr.ReadLine()) != null)
            {
                line = line.Trim();
                if (string.IsNullOrEmpty(line))
                {
                    continue; //boş satorları atalaa
                }

                string[] parts = line.Split(',');
                int userId = int.Parse(parts[0].Trim());

                Dictionary<int , double > ratingMap= new Dictionary<int, double>();

                for(int i=1; i<parts.Length && (i-1) <movieIds.Length; i++)
                {
                    string val = parts[i].Trim();
                    double r = string.IsNullOrEmpty(val) ? 0.0:double.Parse(val, System.Globalization.CultureInfo.InvariantCulture); // boş rating 0 kabul edilecek (doğru bir yaklaşım mı ?)

                    if(r != 0.0)
                    {
                        ratingMap[movieIds[i-1]] = r;
                    }
                }

                users.Add(new userNode(userId, ratingMap));
            }
        }
        return users;        
    }

    //movies.csv file için
    public static Dictionary<int ,string> loadMovies(string filePath)
    {
        Dictionary<int, string> movies = new Dictionary<int, string>();

        using (StreamReader sr = new StreamReader(filePath))
        {
            sr.ReadLine();
            string line;
            int skipped = 0;
            while ((line = sr.ReadLine())!=null)
            {
                line = line.Trim();

                if (string.IsNullOrEmpty(line))
                {
                    continue;
                }

                //csv parser(quote-aware)
                string[] parts = SplitCsvLine(line);

                if(parts.Length < 2)
                {
                    skipped++;
                    Console.WriteLine("Skipped line: "+ line);
                    continue;
                }

                try
                {
                    int movieId = int.Parse(parts[0].Trim());
                    string title = parts[1].Trim().Replace("\"","");
                    movies[movieId] = title;
                }
                catch (Exception)
                {
                    skipped++;
                    Console.WriteLine("Error line: "+line);
                }
            }
            Console.WriteLine("Skipped rows: " + skipped);
        }
        return movies;
    }


    //target_use.csv file için (main_data.csv ile format aynı olduğundan yeniden farklı implementasyon kullanmayacağım)
    public static List<userNode> LoadTargetUsers(string filePath)
    {
        return loadMainData(filePath);
    } 


    //headerdan movie idlerini ayıklama
    public static int[] ParseMovieIdsFromHeader(string filePath)
    {
        using(StreamReader sr = new StreamReader(filePath))
        {
            string header = sr.ReadLine();
            if(header == null)
            {
                return new int[0];
            }

            string[] parts = header.Split(',');
            int[] ids = new int[parts.Length-1];

            for (int i=1; i<parts.Length; i++)
            {
                string t =parts[i].Trim();
                ids[i-1]=string.IsNullOrEmpty(t) ? 0: int.Parse(t);
            }
            return ids;
        }
    }

    // "," karakteri sadece quote dışında split edilir(bazı filmlerin adında , var diye)
    private static string[] SplitCsvLine(string line)
    {
        List<string> result = new List<string>();
        StringBuilder sb = new StringBuilder();

        // tırnak içi kontrol flag
        bool inQuotes = false;

        // karakter karakter parse
        foreach (char c in line)
        {
            // quote toggle
            if (c == '"')
            {
                inQuotes = !inQuotes;
            }
            // virgül ve quote dışındaysa split
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

        // son field eklenir
        result.Add(sb.ToString());
        return result.ToArray();
    }
}
