const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  listSuppliers,
  supplierProducts,
  addSupplierProduct,
  compareSuppliers,
  reviewSupplier
} = require('../controllers/supplierController');

const router = express.Router();

router.get('/suppliers', protect, listSuppliers);
router.get('/products', protect, authorize(['supplier']), supplierProducts);
router.post('/products', protect, authorize(['supplier']), addSupplierProduct);
router.get('/compare', protect, compareSuppliers);
router.post('/reviews', protect, reviewSupplier);

module.exports = router;
