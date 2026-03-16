const router = require('express').Router()
const Order = require('../models/Order')
const auth = require('../middleware/auth')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const upload = multer({ dest: 'uploads/' })

// public: track by phone or email
router.get('/track', async (req, res) => {
  const { identifier } = req.query
  if (!identifier) return res.json([])
  const User = require('../models/User')
  const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] })
  if (!user) return res.json([])
  const orders = await Order.find({ user: user._id }).populate('product').sort({ createdAt: -1 })
  res.json(orders)
})

// logged in: my orders
router.get('/mine', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('product').sort({ createdAt: -1 })
  res.json(orders)
})

// admin: all orders
router.get('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' })
  const orders = await Order.find()
    .populate('product')
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
  res.json(orders)
})

// place order (must be logged in)
router.post('/', auth, upload.single('screenshot'), async (req, res) => {
  try {
    let screenshotUrl = ''
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      screenshotUrl = result.secure_url
      fs.unlinkSync(req.file.path)
    }
    const order = await Order.create({
      ...req.body,
      user: req.user.id,
      paymentScreenshot: screenshotUrl
    })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// admin: update status
router.patch('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' })
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(order)
})

module.exports = router