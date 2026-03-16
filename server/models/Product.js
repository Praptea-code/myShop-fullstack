const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  flavour: String,
  puffs: String,
  nicotine: String,
  badge: String,
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Product', ProductSchema)