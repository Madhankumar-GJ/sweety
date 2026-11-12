const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

console.log('--- DEBUG INFO ---');
console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL ? 'EXISTS (Length: ' + process.env.DATABASE_URL.length + ')' : 'MISSING / UNDEFINED');
console.log('------------------');

async function setup() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString || connectionString.includes('undefined')) {
    console.error('ERROR: DATABASE_URL is missing or invalid in your .env file!');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Running database migrations...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      DO $$ BEGIN
          CREATE TYPE slot_enum AS ENUM ('Morning (fasting)', 'After breakfast', 'After lunch', 'After dinner');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;

      CREATE TABLE IF NOT EXISTS readings (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          slot slot_enum NOT NULL,
          value INT NOT NULL CHECK (value >= 40 AND value <= 600),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT unique_user_date_slot UNIQUE (user_id, date, slot)
      );
    `);

    console.log('Database tables created successfully!');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    const userRes = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id;`,
      ['Demo Patient', 'demo@sweety.com', hashedPassword]
    );

    console.log('Demo user ready!');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
}

setup();