const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// Database configuration with fallbacks for shared hosting
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital_management',
  port: process.env.DB_PORT || 3306,
  // Shared hosting optimizations
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  // SSL configuration for shared hosting
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
};

let pool = null;

const createPool = () => {
  try {
    pool = mysql.createPool(dbConfig);
    logger.info('Database connection pool created successfully');
    return pool;
  } catch (error) {
    logger.error('Error creating database pool:', error);
    throw error;
  }
};

const connectDB = async () => {
  try {
    if (!pool) {
      pool = createPool();
    }
    
    // Test the connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    
    logger.info('Database connected successfully');
    return pool;
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
};

const executeQuery = async (query, params = []) => {
  try {
    if (!pool) {
      await connectDB();
    }
    
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    logger.error('Query execution error:', error);
    throw error;
  }
};

const closePool = async () => {
  try {
    if (pool) {
      await pool.end();
      pool = null;
      logger.info('Database pool closed successfully');
    }
  } catch (error) {
    logger.error('Error closing database pool:', error);
  }
};

module.exports = {
  connectDB,
  executeQuery,
  closePool,
  pool
}; 