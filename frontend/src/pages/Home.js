import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container">
      <div className="jumbotron bg-light p-5 rounded mb-4">
        <h1 className="display-4">Welcome to Ride Share 🚖</h1>
        <p className="lead">
          Connect with drivers and riders in your area. Book rides easily, create rides as a driver, 
          and manage your ride history all in one place.
        </p>
        
        {isAuthenticated ? (
          <div>
            <p>Welcome back, <strong>{user?.name}</strong>!</p>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
              {user?.role === 'driver' && (
                <Link to="/create" className="btn btn-success">Create a Ride</Link>
              )}
              {user?.role === 'rider' && (
                <Link to="/book" className="btn btn-success">Book a Ride</Link>
              )}
              <Link to="/available" className="btn btn-outline-primary">View Available Rides</Link>
            </div>
          </div>
        ) : (
          <div>
            <p>Get started by creating an account or signing in.</p>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              <Link to="/signin" className="btn btn-outline-primary">Sign In</Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">For Riders</h5>
              <p className="card-text">
                Find and book rides from drivers in your area. View available rides, 
                book instantly, and track your ride history.
              </p>
              <ul className="list-unstyled">
                <li>✓ Browse available rides</li>
                <li>✓ Book rides instantly</li>
                <li>✓ Track ride history</li>
                <li>✓ Manage your profile</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">For Drivers</h5>
              <p className="card-text">
                Create rides and earn money by giving rides to others. Set your own schedule 
                and connect with riders in your area.
              </p>
              <ul className="list-unstyled">
                <li>✓ Create new rides</li>
                <li>✓ Set your own schedule</li>
                <li>✓ Manage ride requests</li>
                <li>✓ Complete rides</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
