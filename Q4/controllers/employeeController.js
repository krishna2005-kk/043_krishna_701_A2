const Employee = require('../models/Employee');
const { getNextEmpId, generateRandomPassword } = require('../utils/helpers');
const { sendEmployeeCredentials } = require('../services/emailService');

exports.list = async (req, res) => {
  const employees = await Employee.find().sort({ empId: 1 });
  res.render('employees', { employees });
};

exports.renderAdd = (req, res) => {
  res.render('addEmployee', { error: null });
};

exports.create = async (req, res) => {
  try {
    const empId = await getNextEmpId();
    const plainPassword = generateRandomPassword(10);

    // send email first
    await sendEmployeeCredentials(req.body.email, empId, plainPassword);

    // create employee (password will be hashed by pre-save hook)
    await Employee.create({
      empId,
      name: req.body.name,
      email: req.body.email,
      password: plainPassword,
      salary: {
        basic: Number(req.body.basic || 0),
        hra: Number(req.body.hra || 0),
        da: Number(req.body.da || 0)
      }
    });

    res.redirect('/employees');
  } catch (err) {
    console.error(err);
    res.status(400).render('addEmployee', { error: err.message || 'Failed to add employee' });
  }
};

exports.renderEdit = async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.redirect('/employees');
  res.render('editEmployee', { emp, error: null });
};

exports.update = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.redirect('/employees');

    emp.name = req.body.name;
    emp.email = req.body.email;
    emp.salary.basic = Number(req.body.basic || 0);
    emp.salary.hra = Number(req.body.hra || 0);
    emp.salary.da = Number(req.body.da || 0);

    await emp.save();
    res.redirect('/employees');
  } catch (err) {
    console.error(err);
    res.status(400).render('editEmployee', { emp: await Employee.findById(req.params.id), error: err.message });
  }
};

exports.remove = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.redirect('/employees');
};
