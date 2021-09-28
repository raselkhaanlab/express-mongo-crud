const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
// define the home page route
router.get('/', productController.list);
router.post('/',productController.save);
module.exports = router;