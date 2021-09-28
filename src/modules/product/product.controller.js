  const mongoose = require('mongoose');
let productModel = require('./model/product.model');
  
  exports.list = async (req,res,next) =>{
    try{
      const data = await productModel.find({},{__v:0});
      return res.json(data);
    }
    catch(e){next(e)}
  };

//save product

exports.save = async (req,res,next) =>{
  try{
    const product = new productModel({...req.body});
  let data = await product.save();
  return res.status(201).json(data);
  }
  catch(e) {
    next(e);
  }
}


