const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
// define the home page route
router.get('/:id',productController.get);
router.put('/:id',productController.update);
router.delete('/:id',productController.delete);
router.get('/', productController.list);
router.post('/',productController.save);
module.exports = router;