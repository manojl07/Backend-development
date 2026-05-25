import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  language: { type: String, required: true },
  rating: { type: Number, required: true },
  releaseYear: { type: Number }
}, { timestamps: true });

const Movie = mongoose.model("Movie", movieSchema)

export default Movie;