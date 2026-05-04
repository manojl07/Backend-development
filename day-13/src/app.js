const express = require('express')
const morgan = require('morgan');
const authrouter = require('./routes/auth.route');
const cookieParser = require('cookie-parser')

const app = express();


app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser())

app.use('/api/auth', authrouter);






module.exports = app;