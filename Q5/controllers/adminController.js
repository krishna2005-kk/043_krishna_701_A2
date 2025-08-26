const Leave = require('../models/leaveModel');
const Employee = require('../models/employeeModel');
let getNextEmpId;
try {
  ({ getNextEmpId } = require('../utils/helpers'));
} catch (e) {
  getNextEmpId = async function getNextEmpIdFallback() {
    // generate EMP + timestamp suffix as unique id fallback
    return 'EMP' + Date.now().toString().slice(-6);
  };
}

// Note: utils/helpers may not exist in this project; we'll implement minimal local helpers below if missing.
async function getNextEmpIdFallback() {
  // generate EMP + timestamp suffix as unique id fallback
  return 'EMP' + Date.now().toString().slice(-6);
}
function generateRandomPassword(len = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$!';
  let pass = '';
  for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

exports.listLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ appliedAt: -1 });
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
    if (!['Approved','Rejected','Pending'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, basic=0, hra=0, da=0 } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'name and email required' });

    // empId generation: try to use existing helper, else fallback
    let empId;
    try {
      if (typeof getNextEmpId === 'function') empId = await getNextEmpId();
      else empId = await getNextEmpIdFallback();
    } catch (e) {
      empId = await getNextEmpIdFallback();
    }
    const plainPassword = (typeof generateRandomPassword === 'function') ? generateRandomPassword(10) : generateRandomPassword(10);

    const employee = new Employee({
      empId,
      name,
      email,
      password: plainPassword,
      salary: { basic: Number(basic), hra: Number(hra), da: Number(da) }
    });
    await employee.save();
    // In production you'd send email to employee; here we return credentials in response for admin to relay.
    res.status(201).json({ empId: employee.empId, password: plainPassword, email: employee.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
