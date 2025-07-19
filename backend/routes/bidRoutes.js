const express = require('express');
const router = express.Router();
const { createBid, getBidsByItem, getUserBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBid);
router.get('/item/:itemId', getBidsByItem);
router.get('/user', protect, getUserBids);

module.exports = router;