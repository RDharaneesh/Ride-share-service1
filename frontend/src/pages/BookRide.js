import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../api';

const BookRide = () => {
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterOrigin, setFilterOrigin] = useState('');
  const [filterDestination, setFilterDestination] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const { user } = useAuth();

  useEffect(() => {
    fetchAvailableRides();
  }, []);

  const fetchAvailableRides = async () => {
    try {
      const response = await API.get('/rides/available');
      setAvailableRides(response.data);
    } catch (error) {
      setError('Failed to fetch available rides');
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async (rideId, driverName) => {
    if (!window.confirm(`Are you sure you want to book this ride with ${driverName}?`)) {
      return;
    }

    try {
      await API.post(`/rides/book/${rideId}`);
      setSuccess('Ride booked successfully! You can view it in "My Rides".');
      fetchAvailableRides(); // Refresh the list
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to book ride');
      setTimeout(() => setError(''), 5000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredRides = availableRides.filter(ride => {
    const originMatch = ride.origin.toLowerCase().includes(filterOrigin.toLowerCase());
    const destinationMatch = ride.destination.toLowerCase().includes(filterDestination.toLowerCase());
    return originMatch && destinationMatch;
  });

  const sortedRides = [...filteredRides].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        return new Date(a.time) - new Date(b.time);
      case 'origin':
        return a.origin.localeCompare(b.origin);
      case 'destination':
        return a.destination.localeCompare(b.destination);
      default:
        return 0;
    }
  });

  const getTimeUntilRide = (dateString) => {
    const now = new Date();
    const rideTime = new Date(dateString);
    const diffMs = rideTime - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMs < 0) return 'Past';
    if (diffHours < 1) return `${diffMinutes} minutes`;
    if (diffHours < 24) return `${diffHours} hours`;
    return `${Math.floor(diffHours / 24)} days`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading available rides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">🚗 Book a Ride</h2>
          <p className="text-muted mb-4">Find and book rides from drivers in your area</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <label htmlFor="filterOrigin" className="form-label">From</label>
          <input
            type="text"
            className="form-control"
            id="filterOrigin"
            placeholder="Enter origin..."
            value={filterOrigin}
            onChange={(e) => setFilterOrigin(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <label htmlFor="filterDestination" className="form-label">To</label>
          <input
            type="text"
            className="form-control"
            id="filterDestination"
            placeholder="Enter destination..."
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <label htmlFor="sortBy" className="form-label">Sort by</label>
          <select
            className="form-select"
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="time">Time</option>
            <option value="origin">Origin</option>
            <option value="destination">Destination</option>
          </select>
        </div>
        <div className="col-md-3 mb-2 d-flex align-items-end">
          <button 
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setFilterOrigin('');
              setFilterDestination('');
              setSortBy('time');
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="row mb-3">
        <div className="col-12">
          <p className="text-muted">
            {filteredRides.length} ride{filteredRides.length !== 1 ? 's' : ''} available
            {filterOrigin || filterDestination ? ' (filtered)' : ''}
          </p>
        </div>
      </div>
      
      {sortedRides.length === 0 ? (
        <div className="text-center py-5">
        <div className="mb-3">
            <i className="bi bi-car-front" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
          </div>
          <h4 className="text-muted">No rides available</h4>
          <p className="text-muted">
            {filterOrigin || filterDestination 
              ? 'No rides match your search criteria. Try adjusting your filters.'
              : 'No available rides at the moment. Check back later or create a ride request!'
            }
          </p>
          <button className="btn btn-primary" onClick={fetchAvailableRides}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      ) : (
        <div className="row">
          {sortedRides.map((ride) => (
            <div key={ride._id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-geo-alt me-2"></i>
                    {ride.origin} → {ride.destination}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-6">
                      <small className="text-muted">Driver</small>
                      <p className="mb-0 fw-bold">{ride.driverId?.name || 'Unknown'}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Status</small>
                      <p className="mb-0">
                        <span className="badge bg-success">Available</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-6">
                      <small className="text-muted">Driver Mobile</small>
                      <p className="mb-0 fw-bold">{ride.driverId?.mobile || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Contact</small>
                      <p className="mb-0">
                        <a href={`tel:${ride.driverId?.mobile}`} className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-telephone me-1"></i>Call
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-6">
                      <small className="text-muted">Date</small>
                      <p className="mb-0">{formatDateOnly(ride.time)}</p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Time</small>
                      <p className="mb-0 fw-bold">{formatTime(ride.time)}</p>
                    </div>
        </div>

        <div className="mb-3">
                    <small className="text-muted">Departure in</small>
                    <p className="mb-0">
                      <span className={`badge ${getTimeUntilRide(ride.time) === 'Past' ? 'bg-danger' : 'bg-info'}`}>
                        {getTimeUntilRide(ride.time)}
                      </span>
                    </p>
                  </div>
                  
                  <div className="d-grid">
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => handleBookRide(ride._id, ride.driverId?.name)}
                    >
                      <i className="bi bi-bookmark-plus me-2"></i>
                      Book This Ride
                    </button>
                  </div>
                </div>
                <div className="card-footer text-muted">
                  <small>
                    <i className="bi bi-clock me-1"></i>
                    Created {formatDate(ride.createdAt)}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="row mt-4">
        <div className="col-12 text-center">
          <button className="btn btn-outline-primary" onClick={fetchAvailableRides}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh Rides
          </button>
        </div>
        </div>
    </div>
  );
};

export default BookRide;
