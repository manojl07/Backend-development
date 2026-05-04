const mongoose = require('mongoose')

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected...!");
  } catch (error) {
    console.error("DB error: ", error);
    process.exit(1);
  }
}

module.exports = connectToDb;


// mongodb+srv://manu:pywltDtbUxf6Vqxa@cluster0.j1dh09a.mongodb.net/day-16