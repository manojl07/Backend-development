import Movie from '../models/movie.model.js'
import APIFeatures from '../utils/apiFeatures.js'

export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: movie
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getAllMovies = async (req, res) => {
  try {
    const totalResults = await Movie.countDocuments();

    const features = new APIFeatures(Movie.find(), req.query)
      .filter()
      .search()
      .sort()
      .paginate();

    const movies = await features.query;

    res.status(200).json({
      success: true,
      results: movies.length,
      totalResults,
      currentPage: features.page,
      totalPages: Math.ceil(totalResults / features.limit),
      data: movies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}