# Ride Share Application Setup Guide

This guide will help you set up and run the Ride Share application on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** (for cloning the repository)

## Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd ride-share
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Set Up Environment Variables

The backend `.env` file has been created with default values. You can modify it if needed:

```env
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=mongodb://localhost:27017/rideshare
PORT=3000
```

### 5. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or start MongoDB daemon (Linux/Mac)
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Get your connection string and update the `MONGO_URI` in `.env`

## Running the Application

### Method 1: Using the provided scripts

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend (in a new terminal):**
```bash
cd frontend
npm start
```

### Method 2: Using the startup scripts

**Windows:**
```bash
# Start both backend and frontend
start-backend.bat
start-frontend.bat
```

**Linux/Mac:**
```bash
# Start both backend and frontend
./start-backend.sh
./start-frontend.sh
```

## Accessing the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3000/api

## Default User Roles

The application supports two user roles:

- **Driver:** Can create rides and complete booked rides
- **Rider:** Can book available rides

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Rides
- `GET /api/rides/available` - Get all available rides (protected)
- `GET /api/rides/my-rides` - Get user's rides (protected)
- `POST /api/rides` - Create a new ride (driver only)
- `POST /api/rides/book/:id` - Book a ride (rider only)
- `PUT /api/rides/complete/:id` - Complete a ride (driver only)

## Features

### For Drivers:
- Create new rides with origin, destination, and time
- View all their rides (available, booked, completed)
- Complete booked rides
- Dashboard with ride statistics

### For Riders:
- Browse available rides
- Book rides from available options
- View their ride history
- Dashboard with booking statistics

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill the process using the port: `npx kill-port 3000`

3. **CORS Issues**
   - The backend is configured to allow all origins in development
   - For production, update CORS settings in `server.js`

4. **Authentication Issues**
   - Clear browser localStorage
   - Check if JWT_SECRET is set in `.env`

## Development

### Backend Structure:
```
backend/
├── middleware/     # Authentication middleware
├── models/         # MongoDB models
├── routes/         # API routes
└── server.js       # Main server file
```

### Frontend Structure:
```
frontend/
├── src/
│   ├── components/    # Reusable components
│   ├── contexts/      # React contexts
│   ├── pages/         # Page components
│   └── api.js         # API configuration
```

## Production Deployment

For production deployment:

1. Set up a production MongoDB database
2. Update environment variables
3. Build the frontend: `npm run build`
4. Use a process manager like PM2 for the backend
5. Set up proper CORS and security settings

## Support

If you encounter any issues, please check:
1. All dependencies are installed
2. MongoDB is running
3. Environment variables are set correctly
4. No port conflicts




