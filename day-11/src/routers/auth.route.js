const express = require('express')
const userModel = require('../model/user.model')
const jwt = require('jsonwebtoken')

const authRouter = express.Router()

authRouter.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email })

  if(isUserAlreadyExists){
    return res.status(409).json({
      message: "User already exists with same email!"
    })
  }

  const user = await userModel.create({
    email, name, password
  })

  const token = jwt.sign({
    id: user._id
  }, process.env.JWT_SECRET)

  res.cookie("jwt_token", token)

  res.status(201).json({
    message: "User registered successfully",
    user,
    token
  })

})


module.exports = authRouter;