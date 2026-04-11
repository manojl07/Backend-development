require('dotenv').config();
const app = require('./app')
const mongoose = require('mongoose');
const connnectToDb = require('./config/database');


connnectToDb();

app.listen(3000, () => {
  console.log("Server started on port : http://localhost:3000");
  
})