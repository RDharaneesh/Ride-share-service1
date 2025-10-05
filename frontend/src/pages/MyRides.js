import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../api';

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await API.get('/rides/my-rides');
      setRides(response.data);
    } catch (error) {
      setError('Failed to fetch rides');
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRide = async (rideId) => {
    if (user?.role !== 'driver') {
      alert('Only drivers can complete rides');
      return;
    }

    try {
      await API.put(`/rides/complete/${rideId}`);
      alert('Ride completed successfully!');
      fetchRides(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to complete ride');
    }
  };

  const handleCancelRide = async (rideId, rideStatus) => {
    const action = rideStatus === 'available' ? 'cancel this ride' : 'cancel your booking';
    if (!window.confirm(`Are you sure you want to ${action}?`)) {
      return;
    }

    try {
      await API.put(`/rides/cancel/${rideId}`);
      alert('Ride cancelled successfully!');
      fetchRides(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to cancel ride');
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
      <h2 className="mb-4">My Rides</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {rides.length === 0 ? (
        <div className="alert alert-info" role="alert">
          You don't have any rides yet.
        </div>
      ) : (
        <div className="row">
          {rides.map(ride => (
            <div key={ride._id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    {ride.origin} → {ride.destination}
                  </h5>
                  <p className="card-text">
                    <strong>Driver:</strong> {ride.driverId?.name || 'You'}<br/>
                    <strong>Driver Mobile:</strong> {ride.driverId?.mobile || 'N/A'}<br/>
                    <strong>Rider:</strong> {ride.riderId?.name || 'Not booked'}<br/>
                    {ride.riderId?.mobile && <><strong>Rider Mobile:</strong> {ride.riderId.mobile}<br/></>}
                    <strong>Date:</strong> {formatDate(ride.time)}<br/>
                    <strong>Status:</strong> 
                    <span className={`badge ms-1 ${
                      ride.status === 'available' ? 'bg-success' : 
                      ride.status === 'booked' ? 'bg-warning' : 
                      ride.status === 'completed' ? 'bg-secondary' :
                      ride.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                    }`}>
                      {ride.status}
                    </span>
                  </p>
                  
                  <div className="d-flex gap-2 flex-wrap">
                    {user?.role === 'driver' && ride.status === 'booked' && (
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleCompleteRide(ride._id)}
                      >
                        Complete Ride
                      </button>
                    )}
                    
                    {(ride.status === 'available' || ride.status === 'booked') && (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelRide(ride._id, ride.status)}
                      >
                        {ride.status === 'available' ? 'Cancel Ride' : 'Cancel Booking'}
                      </button>
                    )}
                    
                    {/* Contact buttons - Show based on user role and ride status */}
                    {user?.role === 'rider' && ride.driverId?.mobile && (
                      <a 
                        href={`tel:${ride.driverId.mobile}`} 
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="bi bi-telephone me-1"></i>Call Driver
                      </a>
                    )}
                    
                    {user?.role === 'driver' && ride.riderId?.mobile && ride.status === 'booked' && (
                      <a 
                        href={`tel:${ride.riderId.mobile}`} 
                        className="btn btn-outline-success btn-sm"
                      >
                        <i className="bi bi-telephone me-1"></i>Call Rider
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRides;
