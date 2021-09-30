const express = require('express');
const authController = require('./auth.controller');
const authMiddleware = require('./auth.middleware');
const router = express.Router();
router.post('/login',authMiddleware.isLogout,authController.login);
router.post('/registration',authMiddleware.isLogout,authController.registration);
router.post('/logout',authMiddleware.isLogin, authController.logout);
module.exports= router;