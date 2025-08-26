const express = require('express');
const router = express.Router();

// Dummy users array (use database in production)
const users = [
  { username: 'user1', password: 'secret1' },
  { username: 'user2', password: 'secret2' }
];

// Login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Handle login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const userFound = users.find(u => u.username === username && u.password === password);
  if (!userFound) {
    return res.render('login', { error: 'Invalid username or password.' });
  }
  req.session.user = userFound.username;
  res.redirect('/home');
});

// Home route (protected)
router.get('/home', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('home', { username: req.session.user });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Default redirect
router.get('/', (req, res) => {
  res.redirect('/login');
});

module.exports = router;
