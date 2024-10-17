const mongoose = require('mongoose');

const CourtSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model('Court', CourtSchema);
