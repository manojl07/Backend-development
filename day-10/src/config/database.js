const mongoose = require('mongoose')

function connectToDb(){
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Database");
    
  })
}

module.exports = connectToDb;


// mongodb+srv://Manoj:2AqO2JZf3PDuGCyR@cluster0.zezzvbz.mongodb.net/