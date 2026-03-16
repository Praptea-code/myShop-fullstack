const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || !password || (!email && !phone))
      return res.status(400).json({ message: 'Name, password, and email or phone required' })
    const exists = await User.findOne({ $or: [{ email }, { phone }] })
    if (exists) return res.status(400).json({ message: 'Account already exists' })
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, phone, password: hashed })
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] })
    if (!user) return res.status(400).json({ message: 'No account found' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Wrong password' })
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router