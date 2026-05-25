import express from 'express'
import { getAllMovies, createMovie } from '../controllers/movie.controller.js'

const router = express.Router();

router.get('/', getAllMovies)
router.post('/', createMovie)

export default router;