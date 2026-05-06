import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Sequelize with MySQL connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  }
);

// Test Database Connection (auto-create DB if it doesn't exist)
export const testConnection = async () => {
  try {
    // First, create the database if it doesn't exist
    const connection = await mysql2.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await connection.end();

    await sequelize.authenticate();
    console.log('✓ Database connection established successfully.');
  } catch (error) {
    console.error('✗ Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Sync Database Models
export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('✓ Database synced successfully.');
  } catch (error) {
    console.error('✗ Database sync failed:', error);
  }
};

export default sequelize;
