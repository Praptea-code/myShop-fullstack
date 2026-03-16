const router = require('express').Router()
const Product = require('../models/Product')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 })
  res.json(products)
})

router.get('/recent', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(3)
  res.json(products)
})

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  res.json(product)
})

router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' })
  const product = await Product.create(req.body)
  res.json(product)
})

router.put('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' })
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(product)
})

router.delete('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' })
  await Product.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router