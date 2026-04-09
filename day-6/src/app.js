//  create server
//  server config krna

const express = require('express');
const mongoose = require('mongoose');

function connectToDb(){
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database is Connected!');
    
  })
}

connectToDb();

const app = express();

module.exports = app