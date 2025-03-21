import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = useSelector(state => state.auth.user);

  const handleNavigation = (path) => {
    navigate(path);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <Link to="/" className="logo">
            Reward System
          </Link>
        </div>

        <div className="navbar-right">
          {user && (
            <>
              <Link 
                to="/activities" 
                className="nav-link"
              >
                Activities
              </Link>
              <Link 
                to="/rewards" 
                className="nav-link"
              >
                Rewards
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link 
                    to="/admin/users" 
                    className="nav-link"
                  >
                    Manage Users
                  </Link>
                  <Link 
                    to="/admin/dashboard" 
                    className="nav-link"
                  >
                    Admin Panel
                  </Link>
                </>
              )}
            </>
          )}

          <div className="profile-section">
            <button 
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </button>

            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-header">
                  <div className="avatar">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <p className="username">{user?.username}</p>
                    <p className="points">{user?.points?.toLocaleString() || 0} points</p>
                  </div>
                </div>
                <div className="profile-menu-items">
                  <button onClick={() => handleNavigation('/profile')}>
                    Profile Settings
                  </button>
                  <button onClick={() => handleNavigation('/activities')}>
                    My Activities
                  </button>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
