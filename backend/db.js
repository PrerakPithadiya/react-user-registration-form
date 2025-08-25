import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('Attempting to connect to database with following config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

// First create a connection without database to create it if it doesn't exist
const initPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create database if it doesn't exist
try {
  await initPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  console.log('Database created or already exists');
} catch (error) {
  console.error('Error creating database:', error);
  process.exit(1);
}

// Create the main connection pool with the database selected
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to check database and table
const checkDatabaseAndTable = async () => {
  try {
    // Check if table exists and get its structure
    const [tables] = await pool.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [process.env.DB_NAME]);

    console.log('Available tables:', tables);

    if (tables.length > 0) {
      // Get table structure
      const [columns] = await pool.query(`
        SHOW COLUMNS FROM users
      `);
      console.log('Table structure:', columns);

      // Get all records
      const [records] = await pool.query(`
        SELECT id, firstName, lastName, email, age, phone, address, city, created_at 
        FROM users
      `);
      console.log('Records in users table:', records);
    }
  } catch (err) {
    console.error('Error checking database:', err);
  }
};

// Test the connection and check database
pool.getConnection()
  .then(async connection => {
    console.log('Database connection was successful');
    connection.release();
    await checkDatabaseAndTable();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

export default pool;
