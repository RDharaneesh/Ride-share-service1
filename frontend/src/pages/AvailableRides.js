import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../api';

const AvailableRides = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await API.get('/rides/available');
      setRides(response.data);
    } catch (error) {
      setError('Failed to fetch rides');
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async (rideId) => {
    if (user?.role !== 'rider') {
      alert('Only riders can book rides');
      return;
    }

    try {
      await API.post(`/rides/book/${rideId}`);
      alert('Ride booked successfully!');
      fetchRides(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to book ride');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="d-flex justify-content-center"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container">
      <h2>Available Rides</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {rides.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No available rides at the moment.
        </div>
      ) : (
        <div className="row">
          {rides.map((ride) => (
            <div key={ride._id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {ride.origin} → {ride.destination}
                  </h5>
                  <p className="card-text">
                    <strong>Driver:</strong> {ride.driverId?.name || 'Unknown'}<br/>
                    <strong>Time:</strong> {formatDate(ride.time)}<br/>
                    <strong>Status:</strong> 
                    <span className={`badge ms-1 ${
                      ride.status === 'available' ? 'bg-success' : 
                      ride.status === 'booked' ? 'bg-warning' : 'bg-secondary'
                    }`}>
                      {ride.status}
                    </span>
                  </p>
                  
                  {user?.role === 'rider' && ride.status === 'available' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleBookRide(ride._id)}
                    >
                      Book Ride
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableRides;