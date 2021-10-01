  const mongoose = require('mongoose');
  const userModel = require('./model/user.model');
  const bcrypt = require('bcryptjs');
  const conf = require('../../config');
  const {Mail} = require('./../../common/mail/nodemailer');
  const {validationResult} = require("express-validator");
  
  exports.list = async (req,res,next) =>{
    try{
      const data = await userModel.find({},{__v:0},{sort:{
        'createdAt':-1
      }});
      return res.json(data);
    }
    catch(e){next(e)}
  };

  exports.get = async (req,res,next) =>{
    try{
      const id = req.params.id;
      const isValidId=mongoose.isValidObjectId(id);
      if(!isValidId) {
        return res.status(400).json({errors:`${id} is not a valid id` });
      }
      const data = await userModel.findById(id,{__v:0});
      if(data) return res.json(data);
      return res.status(404).json();
    }
    catch(e){
      console.log(e);
      next(e);
    }
  };

  exports.profile = async (req,res,next) =>{
    try{
      const id = req.session.user._id;
      const isValidId=mongoose.isValidObjectId(id);
      if(!isValidId) {
        // return res.status(400).json({errors:`${id} is not a valid id` });
        return res.sendStatus(404);
      }
      const data = await userModel.findById(id,{__v:0});
      if(data) return res.render('user/profile',{userProfile:data});
      return res.sendStatus(404);
    }
    catch(e){
      console.log(e);
      next(e);
    }
  };

  exports.update = async (req,res,next) =>{
    
    try{
      const id = req.params.id;
      const isValidId=mongoose.isValidObjectId(id);
      if(!isValidId) {
        return res.status(400).json({errors:`${id} is not a valid id` })
      }
      
      const data = await userModel.findByIdAndUpdate(id,{$set:{...req.body}},{new:true});
      if(data) {
        const {__v,...modData} = data._doc;
        return res.json(modData);
      }
      return res.status(404).json();
    }
    catch(e){
      next(e);
    }
  };

  exports.delete = async (req,res,next) =>{
    try{
      const id = req.params.id;
      const isValidId=mongoose.isValidObjectId(id);
      if(!isValidId) {
        return res.status(400).json({errors:`${id} is not a valid id` })
      }
      let data=await userModel.findByIdAndDelete(id);
      if(data) {
        return res.status(204).json();
      }
       return res.status(404).json();
      
    }
    catch(e){
      console.log(e);
      next(e);
    }
  };

//save user

exports.save = async (req,res,next) =>{
  try{
    const user = new userModel({...req.body});
  let data = await user.save();
  return res.status(201).json(data);
  }
  catch(e) {
    next(e);
  }
}


//change password view
exports.changePassword = async(req,res,next)=>{
  try{
    return res.render("user/changePassword");
  }
  catch(e) {
    return next(e);
  }
}
//save change password
exports.saveChangePassword = async(req,res,next)=>{
  try{
    const post = req.body;
    const userEmail = req.session.user.email;

    if(!post.old_password || !post.new_password || !post.confirm_password) {
      req.flash('error','Sorry ! you have to fill all the input field');
      return res.redirect('back');
    }
    if(post.new_password.trim() !==post.confirm_password.trim()) {
      req.flash('error','Sorry ! Confirm password not match with new password');
      return res.redirect('back');
    }
    const user = await userModel.findOne({email:userEmail}).select(['password']).exec();
     if(!bcrypt.compareSync(post.old_password.trim(),user.password)) {
      req.flash('error','Sorry ! Current password did not match');
      return res.redirect('back');
     }
    const password =bcrypt.hashSync(post.confirm_password.trim(), 8); 
    const update = await userModel.updateOne({email:userEmail},{password:password});
    req.flash("success",'Congratulations! you successfuly change you password.');
    return res.redirect('back');
  }
  catch(e) {
    return next(e);
  }
}

exports.forgetPassword = async (req,res,next) =>{
  try{
    const email = req.body.email;
    if(!email) {
      return res.status(400).json({email:'email should not be empty'});
    }
    const user = await userModel.findOne({email:email}).select(['email','password','first_name','last_name','mobile_number']).exec();
    if(!user) {
      return res.status(400).json({email:'email is not registered'});
    }
    const secret = conf.jwt.passwordResetJwtSecret;
    const jwt = require('jsonwebtoken');
    const exp = (Math.floor(Date.now() / 1000) + (60 * 60))*24;
    const payload = {exp:exp,email:email,tracking:user.password};
    const token = jwt.sign(payload,secret);
    const mail = new Mail();
    let link = [req.protocol,'://',req.hostname,((conf.port==443|| conf.port==80)?'':`:${conf.port}`),'/users/reset-password/',token].join('');
    // console.log({link});

    const html = `
      <h5> Hi, ${user.first_name} ${user.last_name}</h5>
      <br>
      <p>Please follow the link below for reset your password - </p>
      <p> <a href="${link}">${link}</a></p>
    `;
    const sendSuccess=await mail.sendEmail(email,'Password reset link',html);
    console.log({sendSuccess});
    // console.log({html});
    return res.status(200).json({email:('A password reset link has been send to your email: '+ email)});
  }
  catch(e){next(e)}
}

exports.resetPassword = async (req,res,next) =>{
  try{
    const token = req.params.token;
    let payload = null;
    const secret = conf.jwt.passwordResetJwtSecret;
    const jwt = require('jsonwebtoken');
    try{
      payload = jwt.verify(token,secret);
    }
    catch(e) {
      if(e instanceof jwt.TokenExpiredError) {
        req.flash('error','Password reset link expired!');
        return res.redirect('/');
      }
      req.flash('error',"Invalid password reset link!");
      return res.redirect('/');
    }
    const email = payload.email;
    const user = await userModel.findOne({email:email}).select(['email','password','first_name','last_name','mobile_number']).exec();
    if(!user) {
      req.flash('error',"Invalid password reset link!");
      return res.redirect('/');
    }
    if(user.password !==payload.tracking) {
      req.flash('error',"Reset password link already use once.");
      return res.redirect('/');
    }
    return res.render("user/resetPassword",{token:token});
  }
  catch(e){next(e)}
}

exports.resetPasswordSave = async (req,res,next) => {
  try{
    const token = req.params.token;
    let payload = null;
    const secret = conf.jwt.passwordResetJwtSecret;
    const jwt = require('jsonwebtoken');
    try{
      payload = jwt.verify(token,secret);
    }
    catch(e) {
      if(e instanceof jwt.TokenExpiredError) {
        req.flash('error','Password reset link expired!');
        return res.redirect('/');
      }
      req.flash('error',"Invalid password reset link!");
      return res.redirect('/');
    }
    const email = payload.email;
    const user = await userModel.findOne({email:email}).select(['email','password','first_name','last_name','mobile_number']).exec();
    if(!user) {
      req.flash('error',"Invalid password reset link!");
      return res.redirect('/');
    }
    if(user.password !==payload.tracking) {
      req.flash('error',"Sorry! This reset password link already used.");
      return res.redirect('/');
    }
    const {new_password,confirm_password} = req.body;
    if(!new_password || !confirm_password) {
      req.flash("error",'sorry! new password and confirm password should not be empty')
      return res.redirect('back');
    }
    if(new_password !== confirm_password) {
      req.flash("error",'sorry! confirm password did not match with new password');
      return res.redirect('back');
    }
  
    user.password = bcrypt.hashSync(confirm_password, 8);
    const data = await user.save();
    console.log(data);
    req.flash("success",'Congratulation! You can login with your new password!')
    return res.redirect('/');
  }
  catch(e){next(e)}
}


