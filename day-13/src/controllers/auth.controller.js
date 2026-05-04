const userModel = require("../model/user.model")
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config/config')



// REGISTRATION
async function register(req, res) {
   const { username, email, password } = req.body

   const isAlreadyRegistered = await userModel.findOne({
    $or: [
      {username},
      {email}
    ]
   })

   if(isAlreadyRegistered){
    return res.status(409).json({
      message: "Username or email already exists!"
    })
   }

   const hash = crypto.createHash("md5").update(password).digest("hex")

   const user = await userModel.create({
    username,
    email,
    password: hash
   })

   const accessToken = jwt.sign({
    id: user._id
   }, config.JWT_SECRET, {expiresIn: "15m"})
   const refreshToken = jwt.sign({
    id: user._id
   }, config.JWT_SECRET, {expiresIn: "7d"})

   res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
   })

 

   res.status(201).json({
    message: "User registered successfully",
    user : {
      user: user.username,
      email: user.email,
    },
    accessToken,
   })

}


// GET-ME - FETCHING USER
async function getMe(req, res){
  const token = req.headers.authorization?.split(" ")[1];

  if(!token){
    return res.status(401).json({
      messahe: "Token not provided"
    })
  }

  const decoded = jwt.verify(token, config.JWT_SECRET);

  const user = await userModel.findById(decoded.id)

  res.status(200).json({
    message: "User fetched successfuly",
    user: {
      user: user.username,
      email: user.email,
    }
  })
}

// refreshToken
async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    return res.status(401).json({
      message: "Refresh token not found"
    })
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

  const accessToken = jwt.sign({
    id: decoded.id
  }, config.JWT_SECRET, {expiresIn: "15m"})

  const newRefreshToken = jwt.sign({
    id: decoded.id
  }, config.JWT_SECRET, {expiresIn: "7d"})

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60  * 1000 // 7days
  })

  res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken
  })
}

// LOGIN


module.exports = {
  register,
  getMe,
  refreshToken,
}