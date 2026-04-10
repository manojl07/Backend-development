const mongoose = require('mongoose')
// VJ0GAbqwgSXJdDQ2
function connectToDb(){
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Database");
    
  })
}

module.exports = connectToDb;