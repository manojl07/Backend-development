const Product = require('../models/product.model.js');
const buildQuery = require('../utils/buildQuery.js');


exports.getProducts = async (req, res, next) => {
  try {
    // PAGINATION
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //SORTING
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: order }

    // FILTERS
    const filters = buildQuery(req.query);

    // QUERY
    const [products, total] = await Promise.all([
      Product.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(filters)
    ])

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    next(error);
  }
}