//  create server
//  server config krna

const express = require('express');
const mongoose = require('mongoose');

function connectToDb(){
  mongoose.connect('mongodb+srv://manoj:YYugGzLQcUc0dVNx@cluster0.hibdigb.mongodb.net/day-6')
  .then(() => {
    console.log('Database is Connected!');
    
  })
}

connectToDb();

const app = express();

module.exports = app