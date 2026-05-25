import express from 'express'
import movieRoutes from './routes/movie.route.js';

const app = express();

// MIDDLEWARE'S
app.use(express.json());
app.use('/api/movies', movieRoutes);


export default app;