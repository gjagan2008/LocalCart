const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, default: 'Local City' },
    pincode: { type: String, default: '100001' }
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
  },
  openingTime: {
    type: String,
    default: '08:00 AM'
  },
  closingTime: {
    type: String,
    default: '10:00 PM'
  },
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active'
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Shop', shopSchema);
