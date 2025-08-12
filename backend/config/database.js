const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'hms_user',
  password: process.env.DB_PASSWORD || 'hms_password',
  database: process.env.DB_NAME || 'hospital_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error.message);
    return false;
  }
};

// Initialize database connection
const connectDB = async () => {
  let retries = 5;
  while (retries > 0) {
    const connected = await testConnection();
    if (connected) {
      break;
    }
    retries--;
    if (retries > 0) {
      logger.info(`Retrying database connection... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  if (retries === 0) {
    logger.error('Failed to connect to database after multiple attempts');
    process.exit(1);
  }
};

// Execute query with error handling
const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
};

// Execute transaction
const executeTransaction = async (queries) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const query of queries) {
      const [rows] = await connection.execute(query.sql, query.params || []);
      results.push(rows);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    logger.error('Transaction error:', error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  connectDB,
  executeQuery,
  executeTransaction,
  testConnection
}; 