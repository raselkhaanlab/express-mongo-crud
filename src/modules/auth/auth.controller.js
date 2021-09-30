const userModel = require('./../user/model/user.model');
const bcrypt = require('bcryptjs');

exports.login=async(req,res,next) =>{
  
  let user = await userModel.findOne({email:req.body.email}).select(['first_name','last_name','email','password']).exec();
  
  if(!user) {
    req.flash('error','sorry! Incrrect email or password');
    return res.redirect('back');
  }
  const isMatch = bcrypt.compareSync(req.body.password.trim(),user.password);
  if(!isMatch) {
    req.flash('error','sorry! Incrrect email or password');
    return res.redirect('back');
  }

  if(req.body.remember_me) {
    req.session.remember_me = {
      email:req.body.email,
      password:req.body.password
    };
  }

  req.session.isLogin = true;
  req.session.user = user;
  req.flash('success','Welcome! you are logged in.')
  return res.redirect('/products');
}

exports.registration = async(req,res,next)=>{
    try{
        const user = new userModel({...req.body});
        let data = await user.save();
        return res.status(201).json(data);
      }
      catch(e) {
        next(e);
      }
}

exports.logout = async (req,res,next) =>{
  const rememberMe = req.session && req.session.remember_me;
  req.session.regenerate((err)=>{
    if(err) {
      next(err);
    }
    if(rememberMe) {
      req.session.email = rememberMe.email;
      req.session.password = rememberMe.password;
    }
    req.flash('success',"Logout successful,Hope you will come back soon :)");
    return res.redirect("/");
  });
  // return res.redirect("/");
}


