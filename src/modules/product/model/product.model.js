const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
        unique:true
    },
    unit_price:{
        type:Number,
        required:true,
        min:1
    },
    total_product:{
        type     : Number,
        required:true,
        min:1,
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