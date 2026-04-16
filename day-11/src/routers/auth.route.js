const express = require('express')
const userModel = require('../model/user.model')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const authRouter = express.Router()

authRouter.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email })

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User already exists with same email!"
    })
  }

 const hash = crypto.createHash("md5").update(password).digest("hex");
  const user = await userModel.create({
    email, name, password: hash
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

authRouter.post("/protected", (req, res) => {
  console.log(req.cookies);
  res.status(200).json({
    message: "This is protected route"
  })

})

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email })
  if(!user){
    return res.status(404).json({
      message: "User not found with this email!"
    })
  }

  const isPasswordMatched = user.password === password;

  if(!isPasswordMatched){
    return res.status(401).json({
      message: "Invalid password"
    })
  }

  const token = jwt.sign({
    id: user._id
  }, process.env.JWT_SECRET)

  res.cookie("jwt_token", token)

  res.status(200).json({
    message: "User Logged successfully",
    user
  })
})


module.exports = authRouter;