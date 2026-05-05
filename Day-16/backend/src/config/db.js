const mongoose = require('mongoose')

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to DB!");
  } catch (error) {
    console.error("DB error: ", error);
  }
}

module.exports = connectToDb;