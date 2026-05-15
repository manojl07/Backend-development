import { configDotenv } from 'dotenv';
configDotenv();
import app from './app.js'
import connectToDb from './config/db.js';


connectToDb();

app.listen(process.env.PORT, () => {
  console.log("Server connected to IP : http://localhost:3000");
})