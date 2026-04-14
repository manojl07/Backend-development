const mongoose = require('mongoose')

function connectToDb(){
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Coneccted to database"); 
  })
}

module.exports = connectToDb


// mongodb+srv://Manu:tb56e0cox3CPn67S@cluster0.ipio9d1.mongodb.net/