  const mongoose = require('mongoose');
let productModel = require('./model/product.model');
  
  exports.list = async (req,res,next) =>{
    try{
      const data = await productModel.find({},{__v:0});
      return res.json(data);
    }
    catch(e){next(e)}
  };

  exports.get = async (req,res,next) =>{
    try{
      const id = req.params.id;
      const isValidId=mongoose.isValidObjectId(id);
      if(!isValidId) {
        return res.status(400).json({errors:`${id} is not a valid id` })
      }
      const data = await productModel.findById(id,{__v:0});
      if(data) return res.json(data);
      return res.status(404).json();
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
      
      const data = await productModel.findByIdAndUpdate(id,{$set:{...req.body}},{new:true});
      if(data) {
        const {__v,...modData} = data._doc;
        return res.json(modData);
      }
      return res.status(404).json();
    }
    catch(e){
      console.log(e);
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
      let data=await productModel.findByIdAndDelete(id);
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


