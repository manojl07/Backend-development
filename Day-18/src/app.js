import express from 'express'

const app = express();

// MIDDLEWARE'S
app.use(express.json());


export default app;