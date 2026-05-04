require('dotenv').config();
const app = require('./app');
const connectToDb = require('./config/db');

connectToDb();

app.listen(3000 , () => {
  console.log("Server running...!");
})