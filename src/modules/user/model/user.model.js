const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    mobile_number:{
        type     : String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    status:{
        type:Boolean,
        default:true
    }
  },
  {timestamps:true}
  );

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;
