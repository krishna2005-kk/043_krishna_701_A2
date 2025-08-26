const Admin = require('../models/Admin');

exports.renderLogin = (req, res) => {
  res.render('login', { error: null });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).render('login', { error: 'Invalid credentials' });

    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).render('login', { error: 'Invalid credentials' });

    req.session.adminId = admin._id;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).render('login', { error: 'Server error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};

exports.dashboard = async (req, res) => {
  res.render('dashboard');
};
