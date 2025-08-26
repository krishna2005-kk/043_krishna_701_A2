const Employee = require('../models/employeeModel');
const jwt = require('jsonwebtoken');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

exports.login = async (req, res) => {
  try {
    const { empId, password } = req.body;
    if (!empId || !password) return res.status(400).json({ message: 'Provide empId and password' });

    const emp = await Employee.findOne({ empId });
    if (!emp) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await emp.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: emp._id, empId: emp.empId });
    res.json({ token, empId: emp.empId, name: emp.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
