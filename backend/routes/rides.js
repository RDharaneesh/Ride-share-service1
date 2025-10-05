const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const { authMiddleware, driverOnly, riderOnly } = require('../middleware/authMiddleware');

// Get all available rides
router.get('/available', authMiddleware, async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'available' }).populate('driverId', 'name email mobile');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's rides (drivers and riders)
router.get('/my-rides', authMiddleware, async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [
        { driverId: req.user.id },
        { riderId: req.user.id }
      ]
    }).populate('driverId', 'name email mobile').populate('riderId', 'name email mobile');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a ride (driver only)
router.post('/', authMiddleware, driverOnly, async (req, res) => {
  try {
    const { origin, destination, time } = req.body;
    const ride = new Ride({ origin, destination, time, driverId: req.user.id });
    await ride.save();
    const populatedRide = await Ride.findById(ride._id).populate('driverId', 'name email mobile');
    res.status(201).json(populatedRide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Book a ride (rider only)
router.post('/book/:id', authMiddleware, riderOnly, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride || ride.status !== 'available') {
      return res.status(400).json({ error: 'Ride not available' });
    }
    ride.riderId = req.user.id;
    ride.status = 'booked';
    await ride.save();
    const populatedRide = await Ride.findById(ride._id).populate('driverId', 'name email mobile').populate('riderId', 'name email mobile');
    res.json(populatedRide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Complete a ride (driver only)
router.put('/complete/:id', authMiddleware, driverOnly, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride || ride.status !== 'booked') {
      return res.status(400).json({ error: 'Ride not booked' });
    }
    ride.status = 'completed';
    await ride.save();
    const populatedRide = await Ride.findById(ride._id).populate('driverId', 'name email mobile').populate('riderId', 'name email mobile');
    res.json(populatedRide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel a ride (driver or rider)
router.put('/cancel/:id', authMiddleware, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    
    // Check if user is the driver or rider
    const isDriver = ride.driverId.toString() === req.user.id;
    const isRider = ride.riderId && ride.riderId.toString() === req.user.id;
    
    if (!isDriver && !isRider) {
      return res.status(403).json({ error: 'You can only cancel your own rides' });
    }
    
    // Only allow canceling if ride is available or booked
    if (ride.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed ride' });
    }
    
    ride.status = 'cancelled';
    ride.riderId = undefined; // Remove rider if driver cancels
    await ride.save();
    const populatedRide = await Ride.findById(ride._id).populate('driverId', 'name email mobile').populate('riderId', 'name email mobile');
    res.json(populatedRide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all rides (admin or for debugging)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rides = await Ride.find().populate('driverId', 'name email mobile').populate('riderId', 'name email mobile');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
