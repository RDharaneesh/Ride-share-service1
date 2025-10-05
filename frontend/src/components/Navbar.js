import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">Ride Share</NavLink>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Home</NavLink>
            </li>
            
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/available">Available Rides</NavLink>
                </li>
                {user?.role === 'driver' && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/create">Create Ride</NavLink>
                  </li>
                )}
                {user?.role === 'rider' && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/book">Book Ride</NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/rides">My Rides</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">Profile</NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signup">Signup</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signin">Signin</NavLink>
                </li>
              </>
            )}
          </ul>
          {isAuthenticated && (
            <div className="d-flex align-items-center">
              <span className="text-light me-3">Welcome, {user?.name}</span>
              <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
