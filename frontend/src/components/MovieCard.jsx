// import React from 'react'
// import fav_icon from '../assets/fav_icon.svg'
// import "../css/MovieCard.css"
// import { useMovieContext } from '../contexts/MovieContexts';
// import { useState } from 'react';
// import { rateMovie } from '../services/api';


// function MovieCard({movie, userId}) {
//     const [rating, setRating] = useState(0);
//     const [hover, setHover] = useState(0);
//     const activeUserId = userId || parseInt(localStorage.getItem("userId"), 10) || 1;

//     const handleRate = async (score) => {
//         setRating(score);
//         try {
//             // Film yılı varsa ekle (Örn: "Toy Story (1995)")
//             const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';
//             const fullTitle = releaseYear ? `${movie.title} (${releaseYear})` : movie.title;

//             await rateMovie(activeUserId, fullTitle, score);
//             console.log("Rating success for:", fullTitle);
//         } catch (err) {
//             console.error("Failed to rate movie:", err);
//         }
//     };


//     const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()

//     const favorite = isFavorite(movie.id)

//     function onFavoriteClick(e) {
//         e.preventDefault()
//         if (favorite) removeFromFavorites(movie.id)
//         else addToFavorites(movie)
//      }



//     return (
//         <div className="movie-card">
//         <div className="movie-poster">
//             <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>

//             {/* <img 
//             src={movie.poster_path || (movie.url ? movie.url : "https://via.placeholder.com/500x750?text=No+Poster")} 
//             alt={movie.title} 
//             /> */}
            
//                 {/* favorite movies */}
//             <div className="movie-overlay">
//                 <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
//                     ♥
//                 </button>
//             </div>


//         </div>
//         <div className="movie-info">
//             <h3>{movie.title}</h3>
//             <p>{movie.release_date ? movie.release_date.split('-')[0] : ''}</p>
            
//             {/* Yıldız Oylama (Interactive Star Rating) */}
//             <div className="star-rating">
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                 type="button"
//                 key={star}
//                 className={star <= (hover || rating) ? "star on" : "star off"}
//                 onClick={() => handleRate(star)}
//                 onMouseEnter={() => setHover(star)}
//                 onMouseLeave={() => setHover(rating)}
//                 >
//                 <span className="star-icon">&#9733;</span>
//                 </button>
//             ))}
//             </div>
//         </div>
//         </div>
//     );
     
//     // return <div className="movie-card">
//     //     <div className="movie-poster">
//     //         <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
//     //         <div className="movie-overlay">
//     //             <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
//     //                 ♥
//     //             </button>
//     //         </div>
//     //     </div>
//     //     <div className="movie-info">
//     //         <h3>{movie.title}</h3>
//     //         <p>{movie.release_date?.split("-")[0]}</p>
//     //     </div>
//     // </div>
// }

// export default MovieCard



import React, { useState, useEffect } from 'react';
import '../css/MovieCard.css';
import { useMovieContext } from '../contexts/MovieContexts';
import { rateMovie } from '../services/api';

function MovieCard({ movie, userId }) {
  const activeUserId = userId || parseInt(localStorage.getItem('userId'), 10) || 1;
  const storageKey = `ratings_${activeUserId}`;

  // 1. Kullanıcının hafızadaki oyu var mı kontrol et
  const getSavedRating = () => {
    try {
      const savedRatings = JSON.parse(localStorage.getItem(storageKey)) || {};
      return savedRatings[movie.title] || 0;
    } catch {
      return 0;
    }
  };

  const [rating, setRating] = useState(getSavedRating);
  const [hover, setHover] = useState(0);

  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id, movie.title);

  // Kullanıcı veya film değiştiğinde oyu güncelle
  useEffect(() => {
    setRating(getSavedRating());
  }, [movie.title, activeUserId]);

  const handleRate = async (score) => {
    setRating(score);

    // Oyu kullanıcıya özel localStorage'a kaydet (Yıldız kalıcı kalsın)
    try {
      const savedRatings = JSON.parse(localStorage.getItem(storageKey)) || {};
      savedRatings[movie.title] = score;
      localStorage.setItem(storageKey, JSON.stringify(savedRatings));
    } catch (err) {
      console.error("Local rating save error:", err);
    }

    // Backend C# API'ye kaydet
    try {
      const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';
      const fullTitle = releaseYear ? `${movie.title} (${releaseYear})` : movie.title;

      await rateMovie(activeUserId, fullTitle, score);
      console.log("Rating success for:", fullTitle);
    } catch (err) {
      console.error("Failed to rate movie:", err);
    }
  };

  const onFavoriteClick = (e) => {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(movie.id, movie.title);
    } else {
      addToFavorites(movie);
    }
  };

  // 2. Poster linkini her sayfaya uygun formatlayan yardımcı fonksiyon
  const getPosterUrl = () => {
    const rawPath = movie.poster_path || movie.url;
    if (!rawPath) return "https://via.placeholder.com/500x750?text=No+Poster";
    
    // Zaten 'http' ile başlıyorsa olduğu gibi kullan
    if (rawPath.startsWith("http")) {
      return rawPath;
    }
    // TMDb'den sadece '/xyz.jpg' gelmişse başına base url ekle
    return `https://image.tmdb.org/t/p/w500${rawPath}`;
  };

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img 
          src={getPosterUrl()} 
          alt={movie.title} 
        />
        
        <div className="movie-overlay">
          <button 
            className={`favorite-btn ${favorite ? "active" : ""}`} 
            onClick={onFavoriteClick}
          >
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
}

export default MovieCard;
