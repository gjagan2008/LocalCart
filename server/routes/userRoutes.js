const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAddresses, addAddress, deleteAddress } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:id', protect, deleteAddress);

module.exports = router;
