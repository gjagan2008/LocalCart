const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Shop = require('../models/Shop');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'localcart_super_secret_jwt_key_2026_production_ready', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (Customer or Seller)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, businessName, shopName, category, shopAddress } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRole = role === 'seller' ? 'seller' : 'customer';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      passwordHash,
      role: userRole,
      status: 'active'
    });

    let seller = null;
    let shop = null;

    if (userRole === 'seller') {
      const bName = businessName || `${name}'s Store`;
      const sName = shopName || `${name}'s Shop`;
      const sCat = category || 'Grocery';
      const sAddr = shopAddress || 'Main Street, Local City';

      seller = await Seller.create({
        userId: user._id,
        businessName: bName,
        verificationStatus: 'approved' // auto-approve registered demo sellers or set to pending
      });

      shop = await Shop.create({
        sellerId: seller._id,
        name: sName,
        description: `Welcome to ${sName}! We provide quality local goods.`,
        category: sCat,
        location: { address: sAddr, city: 'Local City', pincode: '100001' },
        status: 'active'
      });

      seller.shopId = shop._id;
      await seller.save();
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        sellerId: seller ? seller._id : null,
        shopId: shop ? shop._id : null
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Login user & return JWT
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Your account has been blocked by administrator' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let seller = null;
    let shop = null;
    if (user.role === 'seller') {
      seller = await Seller.findOne({ userId: user._id });
      if (seller) {
        shop = await Shop.findOne({ sellerId: seller._id });
      }
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        sellerId: seller ? seller._id : null,
        shopId: shop ? shop._id : null,
        verificationStatus: seller ? seller.verificationStatus : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    let seller = null;
    let shop = null;

    if (user.role === 'seller') {
      seller = await Seller.findOne({ userId: user._id });
      if (seller) {
        shop = await Shop.findOne({ sellerId: seller._id });
      }
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
        sellerId: seller ? seller._id : null,
        shopId: shop ? shop._id : null,
        verificationStatus: seller ? seller.verificationStatus : null
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
