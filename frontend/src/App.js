import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import BookRide from './pages/BookRide';
import MyRides from './pages/MyRides';
import Profile from './pages/Profile';
import CreateRide from './pages/CreateRide';
import AvailableRides from './pages/AvailableRides';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Signin from './pages/Signin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/book" element={
              <ProtectedRoute requireRole="rider">
                <BookRide />
              </ProtectedRoute>
            } />
            
            <Route path="/available" element={
              <ProtectedRoute>
                <AvailableRides />
              </ProtectedRoute>
            } />
            
            <Route path="/create" element={
              <ProtectedRoute requireRole="driver">
                <CreateRide />
              </ProtectedRoute>
            } />
            
            <Route path="/rides" element={
              <ProtectedRoute>
                <MyRides />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
