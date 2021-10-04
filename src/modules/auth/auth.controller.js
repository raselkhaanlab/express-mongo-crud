const {validationResult} = require("express-validator");
const userModel = require('./../user/model/user.model');
const bcrypt = require('bcryptjs');
const utils = require("util");
const {Mail} = require('./../../common/mail/nodemailer');
const conf = require('../../config');
const  {expressValidatorErrFormatter: errFormatter} = require('./../../common/utils/express-validator-error-formatter');

exports.login=async(req,res,next) =>{
  try{
    const user = await userModel.findOne({email:req.body.email}).select(['first_name','last_name','email','password']).exec();
    
    if(!user) {
      req.flash('error','sorry! Incrrect email or password');
      return res.redirect('back');
    }
    const isMatch = bcrypt.compareSync(req.body.password.trim(),user.password);
    if(!isMatch) {
      req.flash('error','sorry! Incrrect email or password');
      return res.redirect('back');
    }
    const regenerate = utils.promisify(req.session.regenerate).bind(req.session);
    await regenerate();
    if(req.body.remember_me) {
      req.session.remember_me = {
        email:req.body.email,
        password:req.body.password
      };
    }

    req.session.isLogin = true;
    req.session.user = user;
    req.flash('success','Welcome! you are logged in.')
    return res.redirect('/dashboard');
  }
  catch(e) {
    return next(e);
  }
}

exports.preRegistration = async (req,res,next) =>{
  try{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      const formattedErr = errFormatter(errors);
      // console.log(formattedErr);
      return res.status(400).json({errors:formattedErr});
    }

    const jwt = require('jsonwebtoken');
    const secret = conf.jwt.registrationSecrect;
    const value = {...req.body};
    const token = jwt.sign(value,secret);
    const mail = new Mail();
    let link = [req.protocol,'://',req.hostname,((conf.port==443|| conf.port==80)?'':`:${conf.port}`),'/auth/new/registration/',token].join('');
    const html = `
      <h4>Hi, ${value.first_name} ${value.last_name} </h4>
      <P>Thank you for your interest.</P>
      <P>Please follow the link below to complete your registration process</P>
      <p> <a href="${link}">${link}</a> </p>
    `;
    // console.log(link);
    await mail.sendEmail(value.email,'Please complete your registration here',html);
    // console.log('mail send');
    return res.status(200).json({message:`Thank you, Please check your email : ${value.email} to complete the registration.`});
  }
  catch(e){
    // console.log(e);
    return res.sendStatus(500);
    // next(e);
  }

};

exports.registrationForm = async(req,res,next) =>{
  try{
    const token = req.params.token;
    let payload = null;
    const secret = conf.jwt.registrationSecrect;
    const jwt = require('jsonwebtoken');
    try{
      payload = jwt.verify(token,secret);
    }
    catch(e) {
      if(e instanceof jwt.TokenExpiredError) {
        req.flash('error','Sorry!Registration link expired!');
        return res.redirect('/');
      }
      req.flash('error',"Sorry!Invalid registration link!");
      return res.redirect('/');
    }
    const email = payload.email;
    if(!email) {
      req.flash('error',"Sorry!Invalid Registration link!");
      return res.redirect('/');
    }
    const user = await userModel.findOne({email:email}).exec();
    if(user) {
      req.flash('error',"Sorry! Registration link expired,there have an account exists with this email.");
      return res.redirect('/');
    }
    return res.render("home/registrationForm",{token:token,payload:payload});
  }
  catch(e) {
    return next(e);
  }
}
exports.registration = async(req,res,next)=>{
    try{
      const token = req.params.token;
      let payload = null;
      const secret = conf.jwt.registrationSecrect;
      const jwt = require('jsonwebtoken');
      try{
        payload = jwt.verify(token,secret);
      }
      catch(e) {
        if(e instanceof jwt.TokenExpiredError) {
          req.flash('error','Registration link expired!');
          return res.redirect('/');
        }
        req.flash('error',"Invalid registration link!");
        return res.redirect('/');
      }
      const email = payload.email;
      if(!email) {
        req.flash('error',"Invalid Registration link!");
        return res.redirect('/');
      }
      const user = await userModel.findOne({email:email}).exec();
      if(user) {
        req.flash('error',"Sorry! Registration link expired,there have an account exists with this email.");
        return res.redirect('/');
      }
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        const formattedErr = errFormatter(errors);
        req.flash('errors',JSON.stringify(formattedErr));
        return res.redirect('back');
      }
      const data = {
        email:payload.email,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        mobile_number:req.body.mobile_number,
        password:req.body.confirm_password
      };
      data.password = bcrypt.hashSync(req.body.confirm_password, 8);
      const userObj = new userModel(data);
      const userData = await userObj.save();
      
      const regenerate = utils.promisify(req.session.regenerate).bind(req.session);
      await regenerate();
      req.session.isLogin = true;
      req.session.user = userData;

      req.flash('success','Welcome! Registration completed and you are logged in now!')
      return res.redirect('/dashboard');
      }
      catch(e) {
        next(e);
      }
}

exports.logout = async (req,res,next) =>{
  const rememberMe = req.session && req.session.remember_me;
  try{
    const regenerate = utils.promisify(req.session.regenerate).bind(req.session);
    await regenerate();
    if(rememberMe) {
      req.session.email = rememberMe.email;
      req.session.password = rememberMe.password;
    }
    req.flash('success',"You are logged out, wating for your come back !!");
    return res.redirect("/");
  }
  catch(e) {next(e)}
}


