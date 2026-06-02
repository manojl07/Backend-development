const buildQuery = (query) => {
  const filters = {};

  // SEARCH
  if (query.search) {
    filters.$text = { $search: query.search }
  }

  // CATEGORY FILTER
  if(query.category){
    filters.category = query.category;
  }

  //BRAND FILTER
  if(query.brand){
    filters.brand = query.brand;
  }

  // PRICE FILTER
  if(query.minPrice || query.maxPrice){
    filters.price = {};

    if(query.minPrice){
      filters.price.$gte = Number(query.minPrice);
    }

    if(query.maxPrice){
      filters.price.$lte = Number(query.maxPrice);
    }
  }
  return filters;
}

module.exports = buildQuery;




// const express = require('express')
// const cors = require('cors')
// const helmet = require('helmet')
// const compression = require('compression')
// const morgan = require('morgan')
// const rateLimit = require('express-rate-limit')

// const productRoutes = require('./routes/product.route.js')
// const errorMiddleware = require('./middlewares/error.middleware.js')
// const notFound = require('./middlewares/notFound.middleware.js')


// const app = express();

// // SECURITY
// app.use(helmet());

// // COMPRESSION
// app.use(compression());

// // RATE LIMIT
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// }))

// app.use(cors())
// app.use(express.json())
// app.use(morgan('dev'))

// app.use('/api/products', productRoutes)

// ap.use(notFound)
// app.use(errorMiddleware)

// module.exports = app;

// require('dotenv').config();

// const app = require('./app')
// const connectDB = require('./config/db.js');

// connectDB();

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// })

// const mongoose = require('mongoose')

// const connetDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB Connected!");
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// }

// module.exports = connetDB;


// const Product = require('../models/product.model.js');
// const buildQuery = require('../utils/buildQuery.js');


// exports.getProducts = async (req, res, next) => {
//   try {
//     // PAGINATION
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     //SORTING
//     const sortBy = req.query.sortBy || "createdAt";
//     const order = req.query.order === 'asc' ? 1 : -1;
//     const sort = { [sortBy]: order }

//     // FILTERS
//     const filters = buildQuery(req.query);

//     // QUERY
//     const [products, total] = await Promise.all([
//       Product.find(filters)
//         .sort(sort)
//         .skip(skip)
//         .limit(limit)
//         .lean(),

//       Product.countDocuments(filters)
//     ])

//     res.status(200).json({
//       success: true,
//       products,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//         hasNextPage: page < Math.ceil(total / limit),
//         hasPrevPage: page > 1,
//       }
//     })
//   } catch (error) {
//     next(error);
//   }
// }


// const errorMiddleware = (err, req, res, next) => {
//   res.status(500).json({
//     success: false,
//     message: err.message,
//   })
// }

// module.exports = errorMiddleware;

// const notFound = (req, res) => {
//   res.status(404).json({
//     message: "Route not found."
//   })
// }

// module.exports = notFound;

// const mongoose = require('mongoose')

// const productSchema = new mongoose.Schema({
//   title: {type: String, required: true, trim: true},
//   category: {type: String, required: true, index: true},
//   brand: {type: String, required: true, index: true},
//   price: {type: Number, required: true, index: true},
//   rating: {type: Number, default: 0, index: true},
// }, {timestamps: true});

// // TEXT INDEX FOR SEARCH
// productSchema.index({
//   title: "text",
//   category: "text",
//   brand: "text",
// })

// module.exports = mongoose.model("Product",  productSchema);

// const express = require('express')
// const router = express.Router();

// const { getProducts } = require('../controllers/product.controller.js');

// router.get('/', getProducts);

// module.exports = router;

// require('dotenv').config();

// const mongoose = require('mongoose')
// const Product = require('../models/product.model.js')

// const connectDB = async () => {
//   await mongoose.connect(process.env.MONGO_URI);
// }

// const categories = ['Laptop', "Phone", 'Watch'];
// const brands = ['Apple', 'Samsung', 'Dell', 'HP'];

// const generateProducts = () => {
//   return Array.from({length: 200}).map((_, index) => ({
//     title: `Product ${index + 1}`,
//     category: categories[Math.floor(Math.random() * categories.length)],
//     brand: brands[Math.floor(Math.random() * brands.length)],
//     price: Math.floor(Math.random() * brands.length),
//     price: Math.floor(Math.random() * 5000),
//     rating: Math.floor(Math.random() * 5) + 1
//   }))
// }

// const seed = async () => {
//   await connectDB();
//   await Product.deleteMany();
//   await Product.insertMany(generateProducts());
//   console.log("Seeded Successfully");
//   process.exit();
// }

// seed();


// const buildQuery = (query) => {
//   const filters = {};

//   // SEARCH
//   if (query.search) {
//     filters.$text = { $search: query.search }
//   }

//   // CATEGORY FILTER
//   if(query.category){
//     filters.category = query.category;
//   }

//   //BRAND FILTER
//   if(query.brand){
//     filters.brand = query.brand;
//   }

//   // PRICE FILTER
//   if(query.minPrice || query.maxPrice){
//     filters.price = {};

//     if(query.minPrice){
//       filters.price.$gte = Number(query.minPrice);
//     }

//     if(query.maxPrice){
//       filters.price.$lte = Number(query.maxPrice);
//     }
//   }
//   return filters;
// }

// module.exports = buildQuery;