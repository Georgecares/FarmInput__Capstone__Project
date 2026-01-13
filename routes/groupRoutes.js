const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { listGroups, createGroup, getGroup, joinGroup, updateGroup, postMessage } = require('../controllers/groupController');

const router = express.Router();

router.get('/', protect, listGroups);
router.post('/', protect, createGroup);
router.get('/:id', protect, getGroup);
router.post('/:id/join', protect, joinGroup);
router.patch('/:id', protect, updateGroup);
router.post('/:id/chat', protect, postMessage);

module.exports = router;
