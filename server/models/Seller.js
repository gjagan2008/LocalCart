const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  documents: {
    taxId: { type: String, default: '' },
    identityProof: { type: String, default: '' },
    businessLicense: { type: String, default: '' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Seller', sellerSchema);
