const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require("helmet")
const { errorHandler } = require('./middlewares/error.middleware')

const authRoutes = require('./routes/auth.route')

const app = express();


app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: true, credentials: true}))

app.use(helmet())
app.use('/app/auth', authRoutes)
app.use(errorHandler)

module.exports = app;