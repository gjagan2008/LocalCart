const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Get all shops with optional search/category filter
// @route   GET /api/shops
const getShops = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { status: 'active' };

    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const shops = await Shop.find(query).sort({ rating: -1 });
    res.json({ success: true, count: shops.length, shops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get shop details by ID + its products & reviews
// @route   GET /api/shops/:id
const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const products = await Product.find({ shopId: shop._id, status: 'active' });
    const reviews = await Review.find({ shopId: shop._id }).populate('customerId', 'name avatar');

    res.json({ success: true, shop, products, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create/Update shop for seller
// @route   POST /api/shops or PUT /api/shops/:id
const updateShop = async (req, res) => {
  try {
    const { name, description, category, location, image, openingTime, closingTime, status } = req.body;
    let shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    if (name) shop.name = name;
    if (description) shop.description = description;
    if (category) shop.category = category;
    if (location) shop.location = location;
    if (image) shop.image = image;
    if (openingTime) shop.openingTime = openingTime;
    if (closingTime) shop.closingTime = closingTime;
    if (status) shop.status = status;

    await shop.save();
    res.json({ success: true, message: 'Shop updated successfully', shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getShops, getShopById, updateShop };
