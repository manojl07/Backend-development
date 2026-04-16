require('dotenv').config();
const app = require('./app');
const connectToDb = require('./config/database');


connectToDb();

app.listen(3000, () => {
  console.log("Server connected on port : http://localhost:3000");
})


// mongodb+srv://Manu:TaUfKbF0Yocg21My@cluster0.ipio9d1.mongodb.net/day-12