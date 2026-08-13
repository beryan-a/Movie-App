import React from "react";
import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login"
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContexts";
import NavBar from "./components/NavBar";


function App() {

  return (
    <MovieProvider>
      <NavBar/>
      <main className='main-content'>
        <Routes>
          <Route path='/' element= {<Home />} />
          <Route path='/favorites' element= {<Favorites />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path='/login' element= {<Login />}/>
        </Routes>
      </main>
    </MovieProvider>
  )
}



export default App