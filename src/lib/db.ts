// src/lib/db.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export async function connectDB() {
  console.log('Conectando a DB con:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
  });

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME,
    });
    console.log('Conexión a DB exitosa');
    return connection;
  } catch (error) {
    console.error('Error conectando a DB:', error);
    throw error;
  }
}
