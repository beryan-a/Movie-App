import { useEffect, useState } from 'react';
import { getFavoritesFromDb, fetchMovieDetailsFromTMDB } from '../services/api';
import MovieCard from '../components/MovieCard';
import '../css/Favorites.css';

function Favorites() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeUserId = parseInt(localStorage.getItem('userId'), 10);

  useEffect(() => {
    const loadFavs = async () => {
      if (!activeUserId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const titles = await getFavoritesFromDb(activeUserId);
        
        // Gelen film isimlerini TMDb'den posterleriyle çekiyoruz
        const movieDetails = await Promise.all(
          titles.map(t => fetchMovieDetailsFromTMDB(t))
        );

        // Boş dönmeyenleri state'e basıyoruz
        setFavoriteMovies(movieDetails.filter(m => m !== null));
      } catch (err) {
        console.error("Error occured during loading:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavs();
  }, [activeUserId]);

  return (
    <div className="favorites" style={{ padding: '2rem' }}>
      <h2>Your favorites movies</h2>
      {loading ? (
        <p>Favorites loading...</p>
      ) : favoriteMovies.length > 0 ? (
        <div className="movies-grid">
          {favoriteMovies.map((movie) => (
            <MovieCard key={movie.id || movie.title} movie={movie} />
          ))}
        </div>
      ) : (
        <p>There are no movies added to favorites yet.</p>
      )}
    </div>
  );
}

export default Favorites;