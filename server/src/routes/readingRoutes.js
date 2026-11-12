const express = require('express');
const router = express.Router();
const { addReading, getReadings, deleteReading } = require('../controllers/readingController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getReadings);
router.post('/', addReading);
router.delete('/:id', deleteReading);

module.exports = router;