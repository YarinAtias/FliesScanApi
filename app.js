const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const connectionString = "";
const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect(connectionString).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const FileRouter = require('./api/route/fileRouter');
app.use('/files', FileRouter);


module.exports = app;