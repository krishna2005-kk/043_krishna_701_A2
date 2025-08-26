const Counter = require('../models/Counter');

async function getNextEmpId() {
  const c = await Counter.findOneAndUpdate(
    { name: 'employee' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return 'EMP' + String(c.seq).padStart(3, '0');
}

function generateRandomPassword(len = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$!';
  let pass = '';
  for (let i = 0; i < len; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
}

module.exports = { getNextEmpId, generateRandomPassword };
