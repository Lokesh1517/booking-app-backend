const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { verifyToken } = require('../middlewares/authMiddleware');

// View available time slots
router.get('/', async (req, res) => {
  const { sportId, date, courtId, centreId } = req.query; // Include centreId in the request
    
  
  try {
    const bookings = await Booking.find({
      courtId, // Filter by specific courtId
      centreId, // Filter by specific centreId
      sportId,
      date: new Date(date)
    });

    // Create a list of available time slots from 2 PM to 10 PM (8 slots total)
    const availableSlots = [];
    const startHour = 14; // 2 PM
    const endHour = 22; // 10 PM

    for (let hour = startHour; hour < endHour; hour++) {
      availableSlots.push({
        startTime: new Date(date).setHours(hour, 0, 0),
        endTime: new Date(date).setHours(hour + 1, 0, 0)
      });
    }

    // Convert booked slots to timestamp format for easier comparison
    const bookedSlots = bookings.map(booking => ({
      startTime: new Date(booking.startTime).getTime(),
      endTime: new Date(booking.endTime).getTime()
    }));

    // Filter out the booked slots
    const finalSlots = availableSlots.filter(slot => {
      return !bookedSlots.some(booked => 
        booked.startTime < slot.endTime && booked.endTime > slot.startTime
      );
    });

    res.json(finalSlots); // Respond with only available slots
  } catch (error) {
    res.status(500).json({ error: 'Error fetching available slots' });
  }
});

// router.get('/view', async (req, res) => {
//     const { centreId, sportId, date } = req.query;
  
//     if (!centreId || !sportId || !date) {
//       return res.status(400).json({ message: 'Centre, sport, and date are required' });
//     }
  
//     try {
//       // Convert the date string to a Date object
//       const startOfDay = new Date(date);
//       startOfDay.setUTCHours(0, 0, 0, 0);
      
//       const endOfDay = new Date(date);
//       endOfDay.setUTCHours(23, 59, 59, 999);
  
//       // Query the database for bookings within that date range
//       const bookings = await Booking.find({
//         centreId,
//         sportId,
//         date: {
//           $gte: startOfDay,
//           $lte: endOfDay,
//         },
//       }).populate('courtId', 'name'); // Populate court details if available
  
//       // Return the list of bookings
//       res.json(
//         bookings.map((booking) => ({
//           _id: booking._id,
//           courtName: booking.courtId.name, // Assuming courtId is a reference to a Court model
//           startTime: booking.startTime,
//           endTime: booking.endTime,
//         }))
//       );
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to retrieve bookings' });
//     }
//   });
  
router.get('/view', async (req, res) => {
    const { centreId, sportId, date } = req.query;
  
    if (!centreId || !sportId || !date) {
      return res.status(400).json({ message: 'Centre, sport, and date are required' });
    }
  
    try {
      // Convert the date string to a Date object
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
  
      // Query the database for bookings within that date range
      const bookings = await Booking.find({
        centreId,
        sportId,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .populate('courtId', 'name') // Populate court details if available
      .populate('userId', 'username'); // Populate user details (assuming `username` is a field in the User model)
  
      // Return the list of bookings
      res.json(
        bookings.map((booking) => ({
          _id: booking._id,
          courtName: booking.courtId.name,
          userName: booking.userId.username, // Get the username of the user who booked
          startTime: booking.startTime,
          endTime: booking.endTime,
        }))
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve bookings' });
    }
  });
  

// Create a booking
router.post('/', async (req, res) => {
  try {
    const { centreId,sportId, courtId, date, startTime, endTime } = req.body;
    const userId = req.user.id; 
   console.log(req.body);
    const booking = new Booking({ userId,centreId, sportId,courtId, date, startTime, endTime });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error creating booking' });
  }
});

module.exports = router;
