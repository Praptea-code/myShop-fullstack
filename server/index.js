const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('DB Error:', err))

app.use('/api/products', require('./routes/products'))
app.use('/api/orders', require('./routes/orders'))

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on http://localhost:5000')
})