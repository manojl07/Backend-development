const mongoose = require("mongoose");

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error.message);
    process.exit(1); // stop server if DB fails
  }
}

module.exports = connectToDb;