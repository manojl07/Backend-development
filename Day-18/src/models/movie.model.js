import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {type: String, required: true},
  genre: {String, required: true},
  language: {type: String, required: true},
  rating: {type: String, required: true},
  releaseYear: {type: Number}
}, {timestamps: true});

const Movie = mongoose.model("Movie", movieSchema)

export default Movie;