const express = require('express');
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/bookingRoutes');
const centreRoutes = require('./routes/centreRoutes');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const authMiddleware = require('./middlewares/authMiddleware');
const cors = require('cors');


const app = express();
console.log("MongoDB URI:", process.env.MONGO_URI); // Debugging MongoDB URI
connectDB(); // Connect to MongoDB

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from React dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true // If you need to send cookies or authentication headers
}));

app.use('/api/auth', authRoutes); // Use auth routes
app.use('/api/centres', authMiddleware, centreRoutes); // Protect centre routes
app.use('/api/bookings', authMiddleware, bookingRoutes); // Protect booking routes
// // Routes
// app.use('/api/centres', centreRoutes); // Centres and sports routes
// app.use('/api/bookings', bookingRoutes); // Booking routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
