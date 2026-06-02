require('dotenv').config();

const mongoose = require('mongoose')
const Product = require('../models/product.model.js')

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
}

const categories = ['Laptop', "Phone", 'Watch'];
const brands = ['Apple', 'Samsung', 'Dell', 'HP'];

const generateProducts = () => {
  return Array.from({length: 200}).map((_, index) => ({
    title: `Product ${index + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    price: Math.floor(Math.random() * 5000),
    rating: Math.floor(Math.random() * 5) + 1
  }))
}

const seed = async () => {
  await connectDB();
  await Product.deleteMany();
  await Product.insertMany(generateProducts());
  console.log("Seeded Successfully");
  process.exit();
}

seed();