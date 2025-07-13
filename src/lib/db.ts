// src/lib/db.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export async function connectDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // por defecto en XAMPP es vacío
    database: 'astro_db',
  });
  return connection;
}
