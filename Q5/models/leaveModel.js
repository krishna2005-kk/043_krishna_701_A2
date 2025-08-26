const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  empId: { type: String, required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending','Approved','Rejected'], default: 'Pending' },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Leave', leaveSchema);
