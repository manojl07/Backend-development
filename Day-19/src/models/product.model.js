const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  title: {type: String, required: true, trim: true},
  category: {type: String, required: true, index: true},
  brand: {type: String, required: true, index: true},
  price: {type: Number, required: true, index: true},
  rating: {type: Number, default: 0, index: true},
}, {timestamps: true});

// TEXT INDEX FOR SEARCH
productSchema.index({
  title: "text",
  category: "text",
  brand: "text",
})

module.exports = mongoose.model("Product",  productSchema);