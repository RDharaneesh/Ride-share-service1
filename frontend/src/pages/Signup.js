import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', mobile: '', role: 'rider' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    const result = await register(form.name, form.email, form.password, form.mobile, form.role);
    
    if (result.success) {
      navigate('/signin', { state: { message: 'Account created successfully! Please sign in.' } });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <form onSubmit={handleSubmit} className="card p-4" style={{ maxWidth: 350, width: '100%' }}>
        <h2 className="mb-3 text-center">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <input name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input name="email" type="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input name="mobile" type="tel" className="form-control" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input name="password" type="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input name="confirm" type="password" className="form-control" placeholder="Confirm Password" value={form.confirm} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <select name="role" className="form-control" value={form.role} onChange={handleChange} required>
            <option value="rider">Rider</option>
            <option value="driver">Driver</option>
          </select>
        </div>
        <button type="submit" className="btn btn-dark w-100" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
