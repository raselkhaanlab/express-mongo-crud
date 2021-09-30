  const mongoose = require('mongoose');
  const userModel = require('./model/user.model');
  const bcrypt = require('bcryptjs');
  
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
    
     const update = await userModel.updateOne({email:userEmail},{password:post.confirm_password.trim()});
     req.flash("success",'Congratulations! you successfuly change you password.');
     return res.redirect('back');
  }
  catch(e) {
    return next(e);
  }
}


