const router = require('express').Router()
const Order = require('../models/Order')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const upload = multer({ dest: 'uploads/' })

router.get('/', async (req, res) => {
  const orders = await Order.find().populate('product').sort({ createdAt: -1 })
  res.json(orders)
})

router.post('/', upload.single('screenshot'), async (req, res) => {
  let screenshotUrl = ''
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path)
    screenshotUrl = result.secure_url
    fs.unlinkSync(req.file.path)
  }
  const order = await Order.create({
    ...req.body,
    paymentScreenshot: screenshotUrl
  })
  res.json(order)
})

router.patch('/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(order)
})

module.exports = router