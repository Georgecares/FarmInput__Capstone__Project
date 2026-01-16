// routes/inputRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getCategories,
  getInputsByCategory,
  logInput,
  updateInputLog,
  deleteInputLog
} = require('../controllers/inputController');

const router = express.Router();

router.get('/categories', protect, getCategories);
router.get('/', protect, getInputsByCategory);
router.post('/log', protect, logInput);
router.put('/log/:id', protect, updateInputLog);
router.delete('/log/:id', protect, deleteInputLog);

module.exports = router;
