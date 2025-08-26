const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const employeeSchema = new mongoose.Schema({
  empId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salary: {
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  joiningDate: { type: Date, default: Date.now }
});

employeeSchema.pre('save', function(next) {
  this.salary.total = (this.salary.basic || 0) + (this.salary.hra || 0) + (this.salary.da || 0);
  next();
});

employeeSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

employeeSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
