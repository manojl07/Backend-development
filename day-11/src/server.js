require('dotenv').config();
const app = require('./app');
const connectToDb = require('./config/database');


connectToDb();

app.listen(3000, () => {
  console.log("Server is started on IP : http://localhost:3000");
})

