import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="d-flex justify-content-center"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="card p-4" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="mb-3 text-center">Profile</h2>
        {user ? (
          <>
            <div className="mb-3">
              <label className="form-label"><strong>Name:</strong></label>
              <p className="form-control-plaintext">{user.name}</p>
            </div>
            <div className="mb-3">
              <label className="form-label"><strong>Email:</strong></label>
              <p className="form-control-plaintext">{user.email}</p>
            </div>
            <div className="mb-3">
              <label className="form-label"><strong>Mobile:</strong></label>
              <p className="form-control-plaintext">{user.mobile}</p>
            </div>
            <div className="mb-3">
              <label className="form-label"><strong>Role:</strong></label>
              <p className="form-control-plaintext">
                <span className={`badge ${user.role === 'driver' ? 'bg-primary' : 'bg-success'}`}>
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </span>
              </p>
            </div>
            <div className="mb-3">
              <label className="form-label"><strong>Member Since:</strong></label>
              <p className="form-control-plaintext">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </>
        ) : (
          <p>No user data available</p>
        )}
        
      </div>
    </div>
  );
};

export default Profile;
