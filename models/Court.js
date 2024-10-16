const mongoose = require('mongoose');

const CourtSchema = new mongoose.Schema({
  name: { type: String, required: true },
    sportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true }
});

module.exports = mongoose.model('Court', CourtSchema);
