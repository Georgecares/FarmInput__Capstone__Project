const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  listCategories,
  listNamesByCategory,
  listSuppliers,
  logNewInput,
  editInputLog,
  deleteInputLog
} = require('../controllers/inputController');

const router = express.Router();

router.get('/categories', protect, listCategories);
router.get('/names', protect, listNamesByCategory);
router.get('/suppliers', protect, listSuppliers);
router.post('/log', protect, logNewInput);
router.patch('/log/:id', protect, editInputLog);
router.delete('/log/:id', protect, deleteInputLog);

module.exports = router;
