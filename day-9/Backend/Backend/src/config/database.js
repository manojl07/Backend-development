// MHAgmTITVoxsfIUy
const mongoose = require('mongoose')

function connnectToDb(){
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to DB');
  })
}

module.exports = connnectToDb;