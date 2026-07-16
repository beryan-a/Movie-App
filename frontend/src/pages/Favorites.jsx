import React from 'react'
import "../css/Favorites.css"
import { useMovieContext } from '../contexts/MovieContexts'
import MovieCard from '../components/MovieCard'


function Favorites() {

  

  return (
    <div className="favorites-empty">
        <h2>No Favorite Movies Yet</h2>
        <p>start adding movies to your favorites and they will appear here</p>
    </div>
  )
}

export default Favorites