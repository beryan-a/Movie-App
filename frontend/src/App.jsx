import React ,{ useState, useEffect } from "react";
import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login"
import { Routes, Route, useNavigate } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContexts";
import NavBar from "./components/NavBar";


function App() {

  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if(savedUserId){
      setCurrentUserId(parseInt(savedUserId, 10));
    }
  },[]);

  const handleLoginSuccess = (userId) => {
    setCurrentUserId(userId);
    navigate("/"); // Giriş yaptıktan sonra Ana Sayfaya git
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setCurrentUserId(null);
  };

  // Eğer kullanıcı giriş yapmadıysa sadece Login ekranını göster
  if (!currentUserId) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <MovieProvider>
      <NavBar userId = {currentUserId} onLogout= {handleLogout}/>
      <main className='main-content'>
        <Routes>
          <Route path='/' element= {<Home userId = {currentUserId}/>} />
          <Route path='/favorites' element= {<Favorites />} />
          <Route path="/recommendations" element={<Recommendations userId = {currentUserId}/>} />
        </Routes>
      </main>
    </MovieProvider>
  )
}



export default App