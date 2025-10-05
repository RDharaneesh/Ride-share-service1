import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRides: 0,
    availableRides: 0,
    bookedRides: 0,
    completedRides: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/rides/my-rides');
      const rides = response.data;
      
      const stats = {
        totalRides: rides.length,
        availableRides: rides.filter(ride => ride.status === 'available').length,
        bookedRides: rides.filter(ride => ride.status === 'booked').length,
        completedRides: rides.filter(ride => ride.status === 'completed').length
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Welcome back, {user?.name}!</p>
      
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Rides</h5>
              <h3>{stats.totalRides}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Available</h5>
              <h3>{stats.availableRides}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Booked</h5>
              <h3>{stats.bookedRides}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Completed</h5>
              <h3>{stats.completedRides}</h3>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;