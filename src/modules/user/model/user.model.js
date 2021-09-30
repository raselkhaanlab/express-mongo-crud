const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

function passwordBcryptHandler(next) {
    const self = this;
    const password = self.password;
    self.password = bcrypt.hashSync(password, 8);
    next();  
}
function passwordBcryptForUpdateHandler(next) {
    const data = this.getUpdate();
    const password = data.password;
    data.password = bcrypt.hashSync(password, 8);
    this.update({}, data).exec()
    next(); 
}


//hasing password before save or update
userSchema.pre("save", passwordBcryptHandler);
userSchema.pre('updateOne',passwordBcryptForUpdateHandler);
userSchema.pre("updateMany",passwordBcryptForUpdateHandler);
userSchema.pre("update",passwordBcryptForUpdateHandler );


const userModel = mongoose.model('user',userSchema);

module.exports = userModel;