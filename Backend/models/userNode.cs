
using System;
using System.Collections;
namespace Backend.models;

public class userNode : IComparable<userNode>
{
    private int userId;

    //instead of hashMap(no hashgMap in C#)
    private Dictionary<int, double> ratings; //rating dic. (length=number of movies)- Stores movie ratings as <movieId, rating>.

    private double similarity;

    public userNode(int userId, Dictionary<int, double> ratings)
    {
        this.userId = userId;
        this.ratings = ratings;
        this.similarity = 0.0;
    }

    //GETTERS
    public int getUserId() {
        return userId;
    }

    public Dictionary<int, double> getRatings() {
        return ratings;
    }

    public double getSimilarity() {
        return similarity;
    }

    public double getRating(int movieId) {
        return ratings.GetValueOrDefault(movieId, 0.0);// Returns the rating for a movie, or 0 if not rated.
    }
    
    //SETTERS
    public void setSimilarity(double s) {
        this.similarity = s;
    }


    
    public int CompareTo(userNode other) { //İki kullanıcıyı similarity değerine göre karşılaştırır.
        // Natural order: higher similarity = "larger" (for max-heap)
        double first = this.similarity;
        double second = other.similarity;

        return first.CompareTo(second); // Returns a negative integer 
        
        /*
        first.compareTo(second)
            Şunu döndürür:
                0   → first == second
                < 0 → first < second
                > 0 → first > second

        */
    
    }
    public override string ToString() 
    {
        return $"User[{userId}, sim={similarity:F4}]";
    }
}
