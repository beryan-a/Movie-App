import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext);


//provide state to any of the components that are wrapped around it
// children is reserved prop when you write a component and children is anything thats inside of the component that you rendered

//local storage allows us to store values directly within our browser
export const MovieProvider = ({children}) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites")

        if(storedFavs) setFavorites(JSON.parse(storedFavs))
    }, [])

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie])
    }

    const removeFromFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
    }

    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}