const mongoose = require('mongoose')
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: String,
  phone: String,
  address: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  paymentScreenshot: String,
  status: {
    type: String,
    enum: ['pending', 'verified', 'dispatched', 'delivered'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Order', OrderSchema)