const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// CRITICAL: Catch idle client errors so they don't crash the server process
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

module.exports = pool;