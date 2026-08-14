import { createContext, useState, useContext, useEffect } from "react";
import { getFavoritesFromDb, toggleFavoriteInDb } from "../services/api";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const activeUserId = parseInt(localStorage.getItem("userId"), 10);

    useEffect(() => {
        const fetchFavs = async () => {
            if (!activeUserId) return;
            try {
                const favTitles = await getFavoritesFromDb(activeUserId);
                setFavorites(favTitles.map(title => ({ title })));
            } catch (err) {
                console.error("Favoriler yüklenemedi:", err);
            }
        };
        fetchFavs();
    }, [activeUserId]);

    const addToFavorites = async (movie) => {
        if (!activeUserId) return;
        const fullTitle = movie.release_date 
            ? `${movie.title} (${movie.release_date.split('-')[0]})` 
            : movie.title;

        try {
            await toggleFavoriteInDb(activeUserId, fullTitle);
            setFavorites(prev => [...prev, movie]);
        } catch (err) {
            console.error("Favori eklenemedi:", err);
        }
    };

    const removeFromFavorites = async (movieId, movieTitle) => {
        if (!activeUserId) return;
        try {
            await toggleFavoriteInDb(activeUserId, movieTitle);
            setFavorites(prev => prev.filter(m => m.title !== movieTitle && m.id !== movieId));
        } catch (err) {
            console.error("Favori silinemedi:", err);
        }
    };

    const isFavorite = (movieId, movieTitle) => {
        return favorites.some(m => m.id === movieId || m.title === movieTitle);
    };

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    };

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>;
};