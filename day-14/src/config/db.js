const mongoose = require('mongoose')

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected...!");
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
};

module.exports = connectToDb;