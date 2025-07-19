const express = require('express');
const router = express.Router();
const { getItems, getItemById, createItem, updateItem, deleteItem } = require('../controllers/itemController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', protect, admin, createItem);
router.put('/:id', protect, admin, updateItem);
router.delete('/:id', protect, admin, deleteItem);

module.exports = router;