import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Recommendations from './pages/Recommendations';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import './css/App.css';

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    const savedUsername = localStorage.getItem("username");
    if (savedUserId) {
      setCurrentUserId(parseInt(savedUserId, 10));
      setCurrentUsername(savedUsername || '');
    }
  }, []);

  const handleLoginSuccess = (userId, username) => {
    setCurrentUserId(userId);
    setCurrentUsername(username);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setCurrentUserId(null);
    setCurrentUsername('');
  };

  if (!currentUserId) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      <NavBar username={currentUsername} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home userId={currentUserId} />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recommendations" element={<Recommendations userId={currentUserId} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;