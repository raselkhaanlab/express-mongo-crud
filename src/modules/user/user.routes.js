const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('./../auth/auth.middleware');
// define the home page route
router.get('/profile',authMiddleware.isLogin,userController.profile);
router.get('/change-password',authMiddleware.isLogin,userController.changePassword);
router.post('/change-password',authMiddleware.isLogin,userController.saveChangePassword);
router.post('/forget-password',authMiddleware.isLogout,userController.forgetPassword);
router.get('/reset-password/:token',authMiddleware.isLogout,userController.resetPassword);
router.post('/reset-password/:token',authMiddleware.isLogout,userController.resetPasswordSave);

router.get('get/:id',userController.get);
router.put('update/:id',userController.update);
router.delete('delete/:id',userController.delete);
router.get('list/', userController.list);
router.post('/',userController.save);
module.exports = router;