const pool = require('../config/db');

const addReading = async (req, res) => {
  try {
    const userId = req.user.id;
    let { date, slot, value } = req.body;

    // Ensure slot is always a clean string scalar
    if (Array.isArray(slot)) slot = slot[0];
    if (typeof slot === 'object' && slot !== null) slot = slot.value || String(slot);

    if (!date || !slot || value === undefined) {
      return res.status(400).json({ error: 'Date, slot, and value are required.' });
    }

    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue < 40 || numericValue > 600) {
      return res.status(400).json({ error: 'Glucose value must be between 40 and 600 mg/dL.' });
    }

    const inputDateStr = typeof date === 'string' ? date.split('T')[0] : new Date().toISOString().split('T')[0];
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    if (inputDateStr > todayStr) {
      return res.status(400).json({ error: 'Date cannot be in the future.' });
    }

    const result = await pool.query(
      `INSERT INTO readings (user_id, date, slot, value) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (user_id, date, slot) 
       DO UPDATE SET value = EXCLUDED.value 
       RETURNING *`,
      [userId, inputDateStr, String(slot), numericValue]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding reading:', err);
    res.status(500).json({ error: err.message || 'Server error while saving reading.' });
  }
};

const getReadings = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM readings WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching readings:', err);
    res.status(500).json({ error: 'Server error while fetching readings.' });
  }
};

const deleteReading = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM readings WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reading not found or unauthorized.' });
    }

    res.json({ message: 'Reading deleted successfully.' });
  } catch (err) {
    console.error('Error deleting reading:', err);
    res.status(500).json({ error: 'Server error while deleting reading.' });
  }
};

module.exports = { addReading, getReadings, deleteReading };