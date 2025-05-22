const express = require('express');
const cors = require('cors');
const AppDataSource = require('./config/database');
const User = require('./entities/User');
const authRoutes = require('./routes/authRoutes');
const softwareRoutes = require('./routes/softwareRoutes');
const requestRoutes = require('./routes/requestRoutes');


const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'User Access Management API' });
});


app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = { app, initializeDatabase };