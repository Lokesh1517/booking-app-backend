const mongoose = require('mongoose');

const CentreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String }
});

module.exports = mongoose.model('Centre', CentreSchema);
