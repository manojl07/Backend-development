const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,                 // ✅ REQUIRED
    unique: [true, "User already exists in database"],                 // ✅ correct usage
    required: true                // (recommended)
  },
  password: String,
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel;