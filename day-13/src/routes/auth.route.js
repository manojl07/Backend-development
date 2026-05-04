const express = require('express')
const authController = require('../controllers/auth.controller');

const authrouter = express.Router();

authrouter.post("/register", authController.register)
authrouter.get("/get-me", authController.getMe)
authrouter.get("/refresh-token", authController.refreshToken)



module.exports = authrouter;