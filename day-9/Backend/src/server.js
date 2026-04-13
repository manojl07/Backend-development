require('dotenv').config();
const app = require('./app')
const mongoose = require('mongoose');
const connnectToDb = require('./config/database');


connnectToDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});