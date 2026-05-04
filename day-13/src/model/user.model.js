const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username already exists!"]
  },
  email: {
    type: String,
    unique: [true, "Email must be unique"]
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  }
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel;