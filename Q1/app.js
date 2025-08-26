const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.use('/', userRoutes);

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
