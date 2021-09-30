const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('./../auth/auth.middleware');
// define the home page route
router.get('/profile',authMiddleware.isLogin,userController.profile);
router.get('/change-password',authMiddleware.isLogin,userController.changePassword);
router.post('/change-password',authMiddleware.isLogin,userController.saveChangePassword);
router.get('/:id',userController.get);
router.put('/:id',userController.update);
router.delete('/:id',userController.delete);
router.get('/', userController.list);
router.post('/',userController.save);
module.exports = router;