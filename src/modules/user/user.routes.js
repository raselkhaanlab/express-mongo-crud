const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('./../auth/auth.middleware');
const userValidator = require("./validators/user.validators");
// define the home page route
router.get('/profile',authMiddleware.isLogin,userController.profile);
router.get('/change-password',authMiddleware.isLogin,userController.changePassword);
router.post('/change-password',authMiddleware.isLogin,userController.saveChangePassword);
router.post('/forget-password',authMiddleware.isLogout,userController.forgetPassword);
router.get('/reset-password/:token',authMiddleware.isLogout,userController.resetPassword);
router.post('/reset-password/:token',authMiddleware.isLogout,userController.resetPasswordSave);

router.get('/api/v1.0/get/:id',authMiddleware.isLogin, userController.get);
router.put('/api/v1.0/:id/update',authMiddleware.isLogin, userValidator.userUpdateValidationRules(), userController.update);
router.delete('/api/v1.0/:id/delete',authMiddleware.isLogin, userController.delete);
router.get('/api/v1.0/list', authMiddleware.isLogin, userController.list);
router.post('/api/v1.0/save',authMiddleware.isLogin, userValidator.userSaveValidationRules(), userController.save);
router.get('/',authMiddleware.isLogin, userController.listView);
module.exports = router;