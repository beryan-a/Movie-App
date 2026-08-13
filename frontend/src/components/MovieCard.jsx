import React from 'react'
import fav_icon from '../assets/fav_icon.svg'
import "../css/MovieCard.css"
import { useMovieContext } from '../contexts/MovieContexts';
import { useState } from 'react';
import { rateMovie } from '../services/api';


function MovieCard({movie, userId}) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const activeUserId = userId || parseInt(localStorage.getItem("userId"), 10) || 1;

    const handleRate = async(score) =>{
        setRating(score);
        try {
            // Film adı yıl içermiyorsa parantez içinde yılını ekleyebiliriz (Örn: "The Odyssey (2026)")
            const fullTitleWithYear = movie.release_date 
                ? `${movie.title} (${movie.release_date.split('-')[0]})` 
                : movie.title;

        await rateMovie(activeUserId, fullTitleWithYear, score);
        } catch (err) {
            console.error("Failed to rate movie: ", err);
        }
    }


    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()

    const favorite = isFavorite(movie.id)

    function onFavoriteClick(e) {
        e.preventDefault()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
     }



    return (
        <div className="movie-card">
        <div className="movie-poster">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>

            {/* <img 
            src={movie.poster_path || (movie.url ? movie.url : "https://via.placeholder.com/500x750?text=No+Poster")} 
            alt={movie.title} 
            /> */}
            
                {/* favorite movies */}
            <div className="movie-overlay">
                <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                    ♥
                </button>
            </div>


        </div>
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.release_date ? movie.release_date.split('-')[0] : ''}</p>
            
            {/* Yıldız Oylama (Interactive Star Rating) */}
            <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                type="button"
                key={star}
                className={star <= (hover || rating) ? "star on" : "star off"}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(rating)}
                >
                <span className="star-icon">&#9733;</span>
                </button>
            ))}
            </div>
        </div>
        </div>
    );
     
    // return <div className="movie-card">
    //     <div className="movie-poster">
    //         <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
    //         <div className="movie-overlay">
    //             <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
    //                 ♥
    //             </button>
    //         </div>
    //     </div>
    //     <div className="movie-info">
    //         <h3>{movie.title}</h3>
    //         <p>{movie.release_date?.split("-")[0]}</p>
    //     </div>
    // </div>
}

export default MovieCard