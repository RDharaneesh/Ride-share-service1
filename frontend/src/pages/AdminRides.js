import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../api';

const AdminRides = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [status, setStatus] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async (query, signal) => {
    try {
      const response = await API.get('/rides', { params: query || undefined, signal });
      setRides(response.data);
    } catch (error) {
      setError('Failed to fetch rides');
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async () => {
    setIsSearching(true);
    setError('');
    const controller = new AbortController();
    try {
      const params = {};
      if (start.trim()) params.origin = start.trim();
      if (destination.trim()) params.destination = destination.trim();
      if (status.trim()) params.status = status.trim();
      await fetchRides(params, controller.signal);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  if (!user || user.role !== 'admin') {
    return <div className="alert alert-danger">Access denied. Admins only.</div>;
  }

  if (loading) {
    return <div className="d-flex justify-content-center"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container">
      <h2>All Rides (Admin)</h2>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Start (origin)"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-2">
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-12 col-md-2 d-grid">
          <button className="btn btn-primary" onClick={onSearch} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {rides.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No rides found.
        </div>
      ) : (
        <div className="row">
          {rides.map((ride) => (
            <div key={ride._id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{ride.origin} → {ride.destination}</h5>
                  <p className="card-text">
                    <strong>Driver:</strong> {ride.driverId?.name || 'Unknown'}<br/>
                    <strong>Rider:</strong> {ride.riderId?.name || 'N/A'}<br/>
                    <strong>Time:</strong> {formatDate(ride.time)}<br/>
                    <strong>Status:</strong>
                    <span className={`badge ms-1 ${
                      ride.status === 'available' ? 'bg-success' : 
                      ride.status === 'booked' ? 'bg-warning' : 
                      ride.status === 'completed' ? 'bg-secondary' : 'bg-danger'
                    }`}>
                      {ride.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRides;





