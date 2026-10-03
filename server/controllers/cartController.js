const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get customer cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customerId: req.user._id }).populate({
      path: 'items.productId',
      select: 'name price image stock status'
    }).populate({
      path: 'items.shopId',
      select: 'name location'
    });

    if (!cart) {
      cart = await Cart.create({ customerId: req.user._id, items: [], subtotal: 0 });
    }

    // Recalculate subtotal
    let subtotal = 0;
    cart.items.forEach(item => {
      if (item.productId) {
        subtotal += item.productId.price * item.quantity;
      }
    });
    cart.subtotal = Math.round(subtotal * 100) / 100;
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < qty) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items available in stock` });
    }

    let cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) {
      cart = new Cart({ customerId: req.user._id, items: [], subtotal: 0 });
    }

    // Check if item already exists in cart
    const existingIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += qty;
      cart.items[existingIndex].price = product.price;
    } else {
      cart.items.push({
        productId: product._id,
        shopId: product.shopId,
        quantity: qty,
        price: product.price
      });
    }

    let subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.subtotal = Math.round(subtotal * 100) / 100;

    await cart.save();
    
    // Return populated cart
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'name price image stock status'
    }).populate({
      path: 'items.shopId',
      select: 'name location'
    });

    res.json({ success: true, message: 'Item added to cart', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:id
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const qty = Number(quantity);

    let cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.id || item.productId.toString() === req.params.id);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = qty;
    }

    let subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.subtotal = Math.round(subtotal * 100) / 100;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'name price image stock status'
    }).populate({
      path: 'items.shopId',
      select: 'name location'
    });

    res.json({ success: true, message: 'Cart updated', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:id
const removeCartItem = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.id && item.productId.toString() !== req.params.id);

    let subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.subtotal = Math.round(subtotal * 100) / 100;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'name price image stock status'
    }).populate({
      path: 'items.shopId',
      select: 'name location'
    });

    res.json({ success: true, message: 'Item removed from cart', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customerId: req.user._id });
    if (cart) {
      cart.items = [];
      cart.subtotal = 0;
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
