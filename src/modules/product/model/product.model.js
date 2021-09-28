const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
        unique:true
    },
    unit_price:{
        type:Number,
        required:true
    },
    total_product:{
        type     : Number,
        required:true,
        validate : {
        validator : Number.isInteger,
        message   : '{VALUE} is not an integer value'
        }
    },
    status:{
        type:Boolean,
        default:true
    }
  },
  {timestamps:true}
  );

  const productModel = mongoose.model('product',productSchema);

  module.exports = productModel;