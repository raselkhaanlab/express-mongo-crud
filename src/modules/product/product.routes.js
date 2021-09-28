const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
// define the home page route
router.get('/', productController.example);
module.exports = router;