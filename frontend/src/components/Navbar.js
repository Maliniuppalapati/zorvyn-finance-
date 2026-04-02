import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav style={{ background: '#222', padding: '15px', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ fontWeight: 'bold' }}>Zorvyn Finance</div>
      <div>
        {!token ? (
          <>
            <Link to="/login" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Login</Link>
             
          </>
        ) : (
          <>
            <Link to="/dashboard" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'red', color: 'white', border: 'none', padding: '5px 10px' }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;