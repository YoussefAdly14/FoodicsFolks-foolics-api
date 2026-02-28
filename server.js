require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

const authRoutes = require('./routes/authRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const adminRoutes = require('./routes/adminRoutes')
const productRoutes = require('./routes/productRoutes')
const PORT = process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerSpec = require('./config/swagger')

app.use(cors())
app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes
app.use('/auth', authRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)
app.use('/admin', adminRoutes)
app.use('/products', productRoutes)

module.exports = app
