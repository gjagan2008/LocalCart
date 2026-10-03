const Product = require('../models/Product');
const Shop = require('../models/Shop');
const Review = require('../models/Review');
const Seller = require('../models/Seller');

// @desc    Get products with search, filter, and sorting
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, minRating, shopId, sort } = req.query;
    let query = { status: 'active' };

    if (shopId) {
      query.shopId = shopId;
    }

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

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    let sortOptions = {};
    if (sort === 'price_asc') sortOptions.price = 1;
    else if (sort === 'price_desc') sortOptions.price = -1;
    else if (sort === 'rating') sortOptions.rating = -1;
    else sortOptions.createdAt = -1; // default newest/popular

    const products = await Product.find(query)
      .populate('shopId', 'name category rating location image')
      .sort(sortOptions);

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shopId', 'name category rating location image phone openingTime closingTime');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = await Review.find({ productId: product._id }).populate('customerId', 'name avatar');
    const relatedProducts = await Product.find({ 
      category: product.category, 
      _id: { $ne: product._id },
      status: 'active'
    }).limit(4);

    res.json({ success: true, product, reviews, relatedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product (Seller)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image, shopId } = req.body;

    let targetShopId = shopId;
    if (!targetShopId) {
      const seller = await Seller.findOne({ userId: req.user._id });
      if (!seller || !seller.shopId) {
        return res.status(400).json({ success: false, message: 'Seller profile or shop not found' });
      }
      targetShopId = seller.shopId;
    }

    const product = await Product.create({
      shopId: targetShopId,
      name,
      description: description || '',
      price: Number(price),
      category: category || 'Grocery',
      stock: Number(stock) || 10,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
      status: 'active'
    });

    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image, status } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (image) product.image = image;
    if (status) product.status = status;

    await product.save();
    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
