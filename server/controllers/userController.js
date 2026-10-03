const User = require('../models/User');
const Address = require('../models/Address');

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    const addresses = await Address.find({ customerId: req.user._id });
    res.json({ success: true, user, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get customer addresses
// @route   GET /api/users/addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ customerId: req.user._id });
    res.json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new address
// @route   POST /api/users/addresses
const addAddress = async (req, res) => {
  try {
    const { label, street, city, state, zipCode, isDefault } = req.body;
    if (isDefault) {
      await Address.updateMany({ customerId: req.user._id }, { isDefault: false });
    }
    const address = await Address.create({
      customerId: req.user._id,
      label: label || 'Home',
      street,
      city,
      state,
      zipCode,
      isDefault: Boolean(isDefault)
    });
    res.status(201).json({ success: true, message: 'Address added', address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
const deleteAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.id, customerId: req.user._id });
    res.json({ success: true, message: 'Address removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, getAddresses, addAddress, deleteAddress };
