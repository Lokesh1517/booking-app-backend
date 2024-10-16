const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  centreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true }, // Reference to Centre
  sportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },   // Reference to Sport
  courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },   // Reference to Court
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

module.exports = mongoose.model('Booking', BookingSchema);
