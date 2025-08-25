import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from frontend
  credentials: true
}));
app.use(express.json());

// Test database connection
const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

testDatabaseConnection();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Routes
app.post('/api/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const { firstName, lastName, username, email, password, age, phone, address, city } = req.body;

    // Log the received data
    console.log({
      firstName, lastName, username, email, 
      age, phone, address, city,
      passwordLength: password ? password.length : 0
    });

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password || !age || !phone || !address || !city) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        age VARCHAR(3) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert user data
    console.log('Attempting to insert user data');
    const [result] = await pool.query(`
      INSERT INTO users (firstName, lastName, username, email, password, age, phone, address, city)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [firstName, lastName, username, email, password, age.toString(), phone, address, city]);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Error in registration:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
