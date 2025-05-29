import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Wedding Halls
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-item">
            Bosh sahifa
          </Link>
          <Link to="/restaurants" className="nav-item">
            To'yxonalar
          </Link>
          
          {user ? (
            <div className="nav-user-menu">
              <span className="nav-username">Salom, {user.username}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-item">Admin Panel</Link>
              )}
              {user.role === 'restaurant_owner' && (
                <Link to="/owner" className="nav-item">To'yxona Panel</Link>
              )}
              {user.role === 'user' && (
                <Link to="/my-reservations" className="nav-item">Mening buyurtmalarim</Link>
              )}
              <button onClick={handleLogout} className="nav-logout-btn">
                Chiqish
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="nav-login-btn">
                Kirish
              </Link>
              <Link to="/register" className="nav-register-btn">
                Ro'yxatdan o'tish
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 