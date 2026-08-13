import { useEffect, useState } from 'react';
import { getRecommendations, fetchMovieDetailsFromTMDB } from '../services/api';
import MovieCard from '../components/MovieCard';

function Recommendations() {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUserId = 1;

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // 1. Backend C# motorundan önerilen film isimlerini al
      const titles = await getRecommendations(currentUserId); // ['Toy Story (1995)', ...]

      // 2. Her film adı için TMDb API'sinden poster ve detay çek
      const fullMovieDetails = await Promise.all(
        titles.map(title => fetchMovieDetailsFromTMDB(title))
      );

      setRecommendedMovies(fullMovieDetails);
    } catch (err) {
      console.error("Error loading recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  return (
    <div className="recommendations-container" style={{padding: '2rem'}}>
      <h2>For You</h2>
      <button style={{backgroundColor:'#4f46e5', color: 'white'}} onClick={loadRecommendations}>Refresh</button>

      {loading ? (
        <p>preparin movie lib and recommendations</p>
      ) : recommendedMovies.length > 0 ? (
        <div className="movies-grid">
          {recommendedMovies.map((movie, index) => (
            <MovieCard key={index} movie={movie} />
          ))}
        </div>
      ) : (
        <p>No ratings found. Please rate movies first.</p>
      )}
    </div>
  );
}

export default Recommendations;