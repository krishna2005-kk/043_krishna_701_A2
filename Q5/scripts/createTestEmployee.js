require('dotenv').config();
const connectDB = require('../config/db');
const Employee = require('../models/employeeModel');

(async () => {
  await connectDB(process.env.MONGO_URI);
  const emp = new Employee({
    empId: 'EMP003',
    name: 'Krishna',
    email: 'krishnavkalsariya2005@example.com',
    password: 'krishna@2005',
    salary: { basic: 20000, hra: 5000, da: 2000 }
  });
  await emp.save();
  console.log('Created', emp.empId);
  process.exit(0);
})();
