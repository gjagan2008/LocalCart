const express = require('express');
const router = express.Router();
const { getShops, getShopById, updateShop } = require('../controllers/shopController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getShops);
router.get('/:id', getShopById);
router.put('/:id', protect, authorize('seller', 'admin'), updateShop);

module.exports = router;
