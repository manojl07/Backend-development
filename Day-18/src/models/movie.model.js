import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {type: String, required: true},
  genre: {type: String, required: true},
  language: {type: String, required: true},
  rating: {type: Number, required: true},
  releaseYear: {type: Number}
}, {timestamps: true});

const Movie = mongoose.model("Movie", movieSchema)

export default Movie;


// [
//   {
//     "title": "Interstellar",
//     "genre": "Sci-Fi",
//     "language": "English",
//     "rating": 9,
//     "releaseYear": 2014
//   },
//   {
//     "title": "Inception",
//     "genre": "Sci-Fi",
//     "language": "English",
//     "rating": 8.8,
//     "releaseYear": 2010
//   },
//   {
//     "title": "The Dark Knight",
//     "genre": "Action",
//     "language": "English",
//     "rating": 9,
//     "releaseYear": 2008
//   },
//   {
//     "title": "Avengers Endgame",
//     "genre": "Action",
//     "language": "English",
//     "rating": 8.4,
//     "releaseYear": 2019
//   },
//   {
//     "title": "Joker",
//     "genre": "Drama",
//     "language": "English",
//     "rating": 8.5,
//     "releaseYear": 2019
//   },
//   {
//     "title": "Parasite",
//     "genre": "Thriller",
//     "language": "Korean",
//     "rating": 8.6,
//     "releaseYear": 2019
//   },
//   {
//     "title": "Train to Busan",
//     "genre": "Horror",
//     "language": "Korean",
//     "rating": 7.6,
//     "releaseYear": 2016
//   },
//   {
//     "title": "3 Idiots",
//     "genre": "Comedy",
//     "language": "Hindi",
//     "rating": 8.4,
//     "releaseYear": 2009
//   },
//   {
//     "title": "Dangal",
//     "genre": "Drama",
//     "language": "Hindi",
//     "rating": 8.3,
//     "releaseYear": 2016
//   },
//   {
//     "title": "KGF Chapter 1",
//     "genre": "Action",
//     "language": "Kannada",
//     "rating": 8.2,
//     "releaseYear": 2018
//   },
//   {
//     "title": "KGF Chapter 2",
//     "genre": "Action",
//     "language": "Kannada",
//     "rating": 8.4,
//     "releaseYear": 2022
//   },
//   {
//     "title": "Kantara",
//     "genre": "Thriller",
//     "language": "Kannada",
//     "rating": 8.3,
//     "releaseYear": 2022
//   },
//   {
//     "title": "Bahubali The Beginning",
//     "genre": "Action",
//     "language": "Telugu",
//     "rating": 8,
//     "releaseYear": 2015
//   },
//   {
//     "title": "Bahubali The Conclusion",
//     "genre": "Action",
//     "language": "Telugu",
//     "rating": 8.2,
//     "releaseYear": 2017
//   },
//   {
//     "title": "Pushpa",
//     "genre": "Action",
//     "language": "Telugu",
//     "rating": 7.9,
//     "releaseYear": 2021
//   },
//   {
//     "title": "RRR",
//     "genre": "Action",
//     "language": "Telugu",
//     "rating": 8,
//     "releaseYear": 2022
//   },
//   {
//     "title": "Your Name",
//     "genre": "Romance",
//     "language": "Japanese",
//     "rating": 8.4,
//     "releaseYear": 2016
//   },
//   {
//     "title": "Spirited Away",
//     "genre": "Fantasy",
//     "language": "Japanese",
//     "rating": 8.6,
//     "releaseYear": 2001
//   },
//   {
//     "title": "The Conjuring",
//     "genre": "Horror",
//     "language": "English",
//     "rating": 7.5,
//     "releaseYear": 2013
//   },
//   {
//     "title": "Annabelle",
//     "genre": "Horror",
//     "language": "English",
//     "rating": 6.1,
//     "releaseYear": 2014
//   },
//   {
//     "title": "John Wick",
//     "genre": "Action",
//     "language": "English",
//     "rating": 7.4,
//     "releaseYear": 2014
//   },
//   {
//     "title": "John Wick Chapter 2",
//     "genre": "Action",
//     "language": "English",
//     "rating": 7.5,
//     "releaseYear": 2017
//   },
//   {
//     "title": "John Wick Chapter 3",
//     "genre": "Action",
//     "language": "English",
//     "rating": 7.7,
//     "releaseYear": 2019
//   },
//   {
//     "title": "Titanic",
//     "genre": "Romance",
//     "language": "English",
//     "rating": 7.9,
//     "releaseYear": 1997
//   },
//   {
//     "title": "La La Land",
//     "genre": "Romance",
//     "language": "English",
//     "rating": 8,
//     "releaseYear": 2016
//   },
//   {
//     "title": "The Matrix",
//     "genre": "Sci-Fi",
//     "language": "English",
//     "rating": 8.7,
//     "releaseYear": 1999
//   },
//   {
//     "title": "Doctor Strange",
//     "genre": "Fantasy",
//     "language": "English",
//     "rating": 7.5,
//     "releaseYear": 2016
//   },
//   {
//     "title": "Shutter Island",
//     "genre": "Thriller",
//     "language": "English",
//     "rating": 8.2,
//     "releaseYear": 2010
//   },
//   {
//     "title": "Fight Club",
//     "genre": "Drama",
//     "language": "English",
//     "rating": 8.8,
//     "releaseYear": 1999
//   },
//   {
//     "title": "The Godfather",
//     "genre": "Crime",
//     "language": "English",
//     "rating": 9.2,
//     "releaseYear": 1972
//   }
// ]