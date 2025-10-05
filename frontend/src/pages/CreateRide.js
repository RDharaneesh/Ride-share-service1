import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const CreateRide = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/rides', formData);
      alert('Ride created successfully!');
      navigate('/rides');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Create New Ride</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="origin" className="form-label">Origin</label>
          <input
            type="text"
            className="form-control"
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="destination" className="form-label">Destination</label>
          <input
            type="text"
            className="form-control"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="time" className="form-label">Departure Time</label>
          <input
            type="datetime-local"
            className="form-control"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Ride'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/rides')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRide;