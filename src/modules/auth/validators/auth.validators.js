const {body} = require('express-validator');
const userModel = require("./../../user/model/user.model");

//pre registration rules
 exports.preRegistrationValidationRule =() => [
    body('first_name').notEmpty()
    .withMessage('first name can not be empty')
    .isLength({min:2,max:50}).withMessage('minimum length 2 and maximum length 50'),

    body('last_name')
    .notEmpty()
    .withMessage('last name can not be empty')
    .isLength({min:2,max:50}).withMessage('minimum length 2 and maximum length 50'),

    body('mobile_number')
    .notEmpty()
    .withMessage('mobile number can not be empty')
    .custom(async value=>{
        const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
        if(!regex.test(value)) {
            return Promise.reject('mobile number must be a bangladeshi operator number')
        }
        const checkNumber = await userModel.findOne({mobile_number:value});
        if(checkNumber) {
            return Promise.reject('mobile number already in use');
        }
    }),

    body('email')
    .notEmpty()
    .withMessage('email can not be empty')
    .isLength({min:4,max:100})
    .withMessage('minimum length 4 and maximum length 100')
    .isEmail().withMessage('email should be a valid email address')
    .custom(async value=>{
        const checkMail = await userModel.findOne({email:value});
        if(checkMail) {
            return Promise.reject('mail already in use');
        }
    })
];

//registration save rules
exports.registrationValidationRules =() => [
    body('first_name').notEmpty()
    .withMessage('first name can not be empty')
    .isLength({min:2,max:50}).withMessage('minimum length 2 and maximum length 50'),

    body('last_name')
    .notEmpty()
    .withMessage('last name can not be empty')
    .isLength({min:2,max:50}).withMessage('minimum length 2 and maximum length 50'),

    body('mobile_number')
    .notEmpty()
    .withMessage('mobile number can not be empty')
    .custom(async value=>{
        const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
        if(!regex.test(value)) {
            return Promise.reject('mobile number must be a bangladeshi operator number')
        }
        let checkNumber = await userModel.findOne({mobile_number:value});
        if(checkNumber) {
            return Promise.reject('mobile number already in use');
        }
    }),

    body('password').notEmpty()
    .withMessage('password can not be empty'),
    
    body('confirm_password').notEmpty()
    .withMessage('confirm password can not be empty')
    .custom(async(value,{req})=>{
        if(req.body.password !== value ) {
            return Promise.reject('confirm password should match with password');
        }
    })

];