const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

router.get('/verify', (req, res) => {
  res.json({ status: 'Auth route active' });
});

module.exports = router;