const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const { notifyOrderUpdate } = require('../services/socketService');

// @desc    Create new order(s) from cart
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { address, paymentMethod } = req.body;

    if (!address || !address.street || !address.city || !address.phone) {
      return res.status(400).json({ success: false, message: 'Please provide full delivery address and phone number' });
    }

    const cart = await Cart.findOne({ customerId: req.user._id }).populate('items.productId');
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    // Group items by shopId so each shop gets a separate order
    const shopGroups = {};
    for (const item of cart.items) {
      if (!item.productId) continue;
      const shopIdStr = item.shopId.toString();
      if (!shopGroups[shopIdStr]) {
        shopGroups[shopIdStr] = [];
      }
      shopGroups[shopIdStr].push({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        image: item.productId.image
      });
    }

    const createdOrders = [];

    for (const [shopId, items] of Object.entries(shopGroups)) {
      const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const deliveryFee = 2.99;
      const totalAmount = Math.round((itemsTotal + deliveryFee) * 100) / 100;

      const order = await Order.create({
        customerId: req.user._id,
        shopId,
        items,
        totalAmount,
        deliveryFee,
        address,
        paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
        paymentStatus: 'PENDING',
        orderStatus: 'PLACED',
        statusHistory: [{
          status: 'PLACED',
          note: 'Order placed by customer'
        }]
      });

      createdOrders.push(order);
      notifyOrderUpdate(order._id, order);
    }

    // Clear user cart
    cart.items = [];
    cart.subtotal = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orders: createdOrders
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get customer orders
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') {
      query.customerId = req.user._id;
    } else if (req.user.role === 'seller') {
      const seller = await Seller.findOne({ userId: req.user._id });
      if (seller && seller.shopId) {
        query.shopId = seller.shopId;
      } else {
        return res.json({ success: true, count: 0, orders: [] });
      }
    }

    const orders = await Order.find(query)
      .populate('shopId', 'name location image rating')
      .populate('customerId', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('shopId', 'name location image phone category openingTime closingTime')
      .populate('customerId', 'name email phone avatar');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (PLACED -> ACCEPTED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Decrement product stock if order is ACCEPTED
    if (status === 'ACCEPTED' && order.orderStatus !== 'ACCEPTED') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    if (status === 'DELIVERED') {
      order.paymentStatus = 'PAID';
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      note: note || `Order status updated to ${status}`
    });

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('shopId', 'name location image phone')
      .populate('customerId', 'name email phone');

    // Notify connected customer tracking page live via Socket.IO!
    notifyOrderUpdate(order._id, updatedOrder);

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
