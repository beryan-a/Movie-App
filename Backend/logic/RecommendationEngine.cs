using Backend.models;

namespace Backend.logic;

public class RecommendationEngine
{
    private List<userNode> mainUsers;
    private Dictionary<int, string> movieTitles;
    private int[] movieIdColumns;
    //CONSTRUCTOR
    public RecommendationEngine(List<userNode> mainUsers,
    Dictionary<int, string> movieTitles, int[] movieIdColumns)
    {
        this.mainUsers = mainUsers;
        this.movieTitles=movieTitles;
        this.movieIdColumns = movieIdColumns;
    }

    public List<string> getRecommendations(Dictionary<int, double> targetRatings, int X, int K) {
        maxHeap heap=new maxHeap();

        foreach(userNode u in mainUsers)
        {
            double sim = cosineSimilarity(targetRatings, u.getRatings());

            u.setSimilarity(sim);

            heap.insert(u);
        }

        List<userNode> topUsers = new List<userNode>();
        for (int i = 0; i < X && !heap.isEmpty(); i++) {
            topUsers.Add(heap.extractMax());
        }
        
        // her kullanıcıdan top-K film alınır
        List<string> recommendations = new List<string>();
        foreach(userNode u in topUsers) {
            recommendations.AddRange(getTopKMovies(u, K));
        }

        return recommendations;

    }

    public static double cosineSimilarity(Dictionary<int,double> a, Dictionary<int, double>b)
    {
        //jaccard
        double m11 = a.Count + b.Count;
        double m10 = a.Count;
        double m01 = b.Count;
        
        if((m01 + m10 + m11) == 0)
        {
            return 0.0;
        }

        return m11/(m01 + m10 + m11);




        // double dot = 0;
        // double normA = 0;
        // double normB =0;

        // foreach (KeyValuePair<int, double> e in a) {
        //     double va  = e.Value; // rating of A
        //     double vb = b.GetValueOrDefault(e.Key, 0.0);// B'de yoksa 0
        //     dot += va  * vb;  // A·B
        //     normA += va  * va; // ||A||^2
        // }
        
        // // B vector norm
        // foreach(double vb in b.Values) {
        //     normB += vb * vb;
        // }
        
        // // division by zero protection!!!
        // if (normA == 0 || normB == 0) {
        //     return 0.0;
        // }

        // return dot / (Math.Sqrt(normA) * Math.Sqrt(normB));
    }

    private List<string> getTopKMovies(userNode user, int K)
    {
        Dictionary<int, double> ratings = user.getRatings();

        // Max-priority queue oluşturma (Rating değerine göre büyükten küçüğe sıralar)
        var pq = new PriorityQueue<KeyValuePair<int, double>, double>(
            Comparer<double>.Create((x, y) => y.CompareTo(x))
        );

        // Kullanıcının puanladığı tüm filmleri PriorityQueue'ya ekliyoruz
        foreach (var kvp in ratings)
        {
            pq.Enqueue(kvp, kvp.Value);
        }
        
        List<string> result = new List<string>();
        int count = 0;

        while (pq.Count > 0 && count < K)
        {
            int movieId = pq.Dequeue().Key;
            result.Add(movieTitles.GetValueOrDefault(movieId, "Movie #" + movieId));
            count++;
        }

        return result;
    }
}