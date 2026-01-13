const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadDocument, listDocuments, reviewDocument } = require('../controllers/verificationController');

const router = express.Router();

router.post('/documents', protect, uploadDocument);
router.get('/documents', protect, listDocuments);
router.patch('/documents/:id/review', protect, authorize(['admin']), reviewDocument);

module.exports = router;
