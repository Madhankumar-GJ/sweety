const pool = require('../config/db');

const getReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.query; // Expected format: 'YYYY-MM'

    let query = 'SELECT * FROM readings WHERE user_id = $1';
    let params = [userId];

    if (month) {
      query += ` AND TO_CHAR(date, 'YYYY-MM') = $2`;
      params.push(month);
    }

    query += ' ORDER BY date ASC';

    const result = await pool.query(query, params);
    const readings = result.rows;

    if (readings.length === 0) {
      return res.json({
        totalReadings: 0,
        average: 0,
        min: 0,
        max: 0,
        readings: []
      });
    }

    const values = readings.map(r => r.value);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = Math.round(sum / values.length);
    const min = Math.min(...values);
    const max = Math.max(...values);

    res.json({
      totalReadings: readings.length,
      average,
      min,
      max,
      readings
    });
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ error: 'Server error while generating report.' });
  }
};

module.exports = { getReport };