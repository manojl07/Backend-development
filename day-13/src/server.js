require('dotenv').config();
const app = require('./app')
const connectDB = require('./config/database')


connectDB();

app.listen(3000, (req, res) => {
  console.log("Server is started on port: 3000");
})



// pywltDtbUxf6Vqxa

// mongodb+srv://manu:pywltDtbUxf6Vqxa@cluster0.j1dh09a.mongodb.net/day-13