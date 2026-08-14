import { useState } from 'react';
import { signupUser, loginUser } from '../services/api';
import '../css/App.css';

function Login({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // 1. Giriş Yapma (Login)
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!username.trim() || !password.trim()) {
      setMessage("Please fill in all fields!");
      setIsError(true);
      return;
    }

    try {
      const data = await loginUser(username, password);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);
      
      if (onLoginSuccess) {
        onLoginSuccess(data.userId, data.username);
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.message || "Invalid username or password!");
      setIsError(true);
    }
  };

  // 2. Yeni Kayıt Olma (Sign Up)
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage("Please fill in all fields!");
      setIsError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setIsError(true);
      return;
    }

    try {
      setMessage("Creating accpunt...");
      const data = await signupUser(username, password); // Backend sıradaki UserId'yi atar
      
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        setMessage(`Registration Successful! Welcome ${data.username}`);
        setIsError(false);

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(data.userId, data.username);
          }
        }, 1200);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(err.message || "An error occurred while creating the account.");
      setIsError(true);
    }
  };

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '32px 24px',
        borderRadius: '18px',
        background: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center', color: "#111" }}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {message && (
          <div style={{
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center',
            fontSize: '14px',
            backgroundColor: isError ? '#ffe6e6' : '#e6ffed',
            color: isError ? '#d32f2f' : '#2e7d32',
            border: `1px solid ${isError ? '#ffcdd2' : '#c8e6c9'}`
          }}>
            {message}
          </div>
        )}

        {!isSignup ? (
          // ==================== LOGIN FORM ====================
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: "#333" }}>
              <label htmlFor="login-username" style={{ fontSize: '14px', fontWeight: 'bold' }}>Username</label>
              <input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  padding: '12px 14px',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: "#333" }}>
              <label htmlFor="login-password" style={{ fontSize: '14px', fontWeight: 'bold' }}>Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: '12px 14px',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  fontSize: '15px'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '8px',
                padding: '12px 18px',
                border: 'none',
                borderRadius: '10px',
                background: '#4f46e5',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          </form>
        ) : (
          // ==================== SIGNUP FORM ====================
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: "#333" }}>
              <label htmlFor="signup-username" style={{ fontSize: '14px', fontWeight: 'bold' }}>Username</label>
              <input
                id="signup-username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  padding: '12px 14px',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: "#333" }}>
              <label htmlFor="signup-password" style={{ fontSize: '14px', fontWeight: 'bold' }}>Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: '12px 14px',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: "#333" }}>
              <label htmlFor="signup-confirm-password" style={{ fontSize: '14px', fontWeight: 'bold' }}>Confirm Password</label>
              <input
                id="signup-confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  padding: '12px 14px',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  fontSize: '15px'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '8px',
                padding: '12px 18px',
                border: 'none',
                borderRadius: '10px',
                background: '#4f46e5',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Sign Up
            </button>
          </form>
        )}

        {/* Geçiş Butonu */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <span
            onClick={() => { 
              setIsSignup(!isSignup); 
              setMessage(''); 
              setPassword('');
              setConfirmPassword('');
            }}
            style={{ color: '#4f46e5', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
          >
            {isSignup ? "Already have an account? Login" : "Don't have an account? Create new account"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;