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
        console.error("Favoriler yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavs();
  }, [activeUserId]);

  return (
    <div className="favorites" style={{ padding: '2rem' }}>
      <h2>Favori Filmleriniz</h2>
      {loading ? (
        <p>Favoriler yükleniyor...</p>
      ) : favoriteMovies.length > 0 ? (
        <div className="movies-grid">
          {favoriteMovies.map((movie) => (
            <MovieCard key={movie.id || movie.title} movie={movie} />
          ))}
        </div>
      ) : (
        <p>Henüz favorilere eklenmiş bir film bulunmuyor.</p>
      )}
    </div>
  );
}

export default Favorites;