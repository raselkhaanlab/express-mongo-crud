const express = require('express');
const authController = require('./auth.controller');
const authMiddleware = require('./auth.middleware');
const {preRegistrationValidationRule,registrationValidationRules} = require('./validators/auth.validators');
const router = express.Router();
router.post('/login',authMiddleware.isLogout,authController.login);
router.post("/pre-registration",authMiddleware.isLogout, preRegistrationValidationRule(), authController.preRegistration);
router.get('/new/registration/:token',authMiddleware.isLogout,authController.registrationForm);
router.post('/new/registration/:token',authMiddleware.isLogout,registrationValidationRules(),authController.registration);
// router.post('/registration',authMiddleware.isLogout,authController.registration);
router.post('/logout',authMiddleware.isLogin, authController.logout);
module.exports= router;