const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

const productRoutes = require('./routes/product.route.js')
const errorMiddleware = require('./middlewares/error.middleware.js')
const notFound = require('./middlewares/notFound.middleware.js')


const app = express();

// SECURITY
app.use(helmet());

// COMPRESSION
app.use(compression());

// RATE LIMIT
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
}))

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorMiddleware)

module.exports = app;