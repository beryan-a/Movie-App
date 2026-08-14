// import React from 'react'
// import { Link } from "react-router-dom"
// import '../css/Navbar.css'

// function NavBar({userId , onLogout}) {
//   return (
//     <nav className="navbar">
//         <div className="navbar-brand">
//             <Link to='/'>Movie App</Link>
//         </div>
//         <div className="navbar-links">
//             <Link to='/' className='nav-link'>Home</Link>
//             <Link to='/favorites' className='nav-link'>Favorites</Link>
//             <Link to="/recommendations" className='nav-link'>Recommendations</Link>
//         </div>

//         <div className="user-profile" style = {{display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff'}}>
//           <span>User ID: <strong>#{userId}</strong></span>
//           <button onClick={onLogout} style={{ padding: '0.3rem 0.6rem', cursor: 'pointer', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}>
//             Log out
//           </button>
//         </div>
//     </nav>
//   )
// }

// export default NavBar
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

function NavBar({ username, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie App</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
        <Link to="/recommendations" className="nav-link">Recommendations</Link>
      </div>
      <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff' }}>
        <span>Welcome, <strong>{username || "user"}</strong></span>
        <button 
          onClick={onLogout} 
          style={{ 
            padding: '0.4rem 0.8rem', 
            cursor: 'pointer', 
            backgroundColor: '#e50914', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Log out
        </button>
      </div>
    </nav>
  );
}

export default NavBar;