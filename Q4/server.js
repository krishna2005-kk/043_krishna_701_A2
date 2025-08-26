require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

const adminRoutes = require('./routes/adminRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

connectDB(process.env.MONGO_URI);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 }
}));

// Seed default admin if not present
(async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      await Admin.create({ username: 'admin', password: 'admin@123' });
      console.log('Seeded default admin: admin / admin@123');
    }
  } catch (err) {
    console.error('Admin seeding error', err);
  }
})();

app.use('/', adminRoutes);
app.use('/', employeeRoutes);

app.get('/', (req, res) => res.redirect('/login'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
