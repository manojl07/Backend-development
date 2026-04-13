// MHAgmTITVoxsfIUy
const mongoose = require('mongoose')

async function connnectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
  }
}

module.exports = connnectToDb;