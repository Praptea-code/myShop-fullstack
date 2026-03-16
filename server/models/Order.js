const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  customerName: String,
  phone: String,
  address: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  paymentScreenshot: String,
  status: {
    type: String,
    enum: ['pending', 'verified', 'shipped'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', OrderSchema)