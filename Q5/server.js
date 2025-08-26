require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const adminRoutes = require('./routes/adminRoutes');


const app = express();
connectDB(process.env.MONGO_URI);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/admin', adminRoutes);

// serve static frontend pages
app.use('/', express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Employee site running on http://localhost:${port}`));
