const express = require('express')
const router = express.Router();

const { getProducts } = require('../controllers/product.controller.js');

router.get('/', getProducts);

module.exports = router;