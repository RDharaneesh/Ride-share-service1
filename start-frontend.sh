#!/bin/bash
echo "Starting Ride Share Frontend..."
echo "Frontend will run on http://localhost:3001"
echo "Backend should be running on http://localhost:5001"
cd frontend
echo "Installing dependencies if needed..."
npm install
echo "Starting frontend development server on port 3001..."
PORT=3001 npm start



