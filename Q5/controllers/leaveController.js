const Leave = require('../models/leaveModel');

exports.apply = async (req, res) => {
  try {
    const { date, reason } = req.body;
    if (!date || !reason) return res.status(400).json({ message: 'Provide date and reason' });

    const leave = await Leave.create({
      empId: req.user.empId,
      date: new Date(date),
      reason,
      status: 'Pending'
    });
    res.status(201).json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listForEmployee = async (req, res) => {
  try {
    const leaves = await Leave.find({ empId: req.user.empId }).sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Approved','Rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
