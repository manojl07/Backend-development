require('dotenv').config();
const app = require('./app');
const connectToDb = require('./config/db');

connectToDb();

app.listen(process.env.PORT, () => {
  console.log("Server connected to IP : http://localhost:3000");
})

