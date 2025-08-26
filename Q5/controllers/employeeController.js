const Employee = require('../models/employeeModel');

exports.profile = async (req, res) => {
  try {
    const emp = await Employee.findOne({ empId: req.user.empId }).select('-password -__v');
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
