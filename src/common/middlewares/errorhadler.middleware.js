//mongoose validation error formating
function formattedMongooseValidatorErrorFunc(err) {
    let errArr= err.toString().replace('ValidationError: ', '').split(',');
    errArr = errArr.map((item)=>{
         let itemArray =item.split(":");
         let key = itemArray[0].toLowerCase().trim();
         let value = itemArray[1].toLowerCase().replace('path','').trim();
         return [key,value];
    });
    return Object.fromEntries(errArr);
}

const HTTP_SERVER_ERROR = 500;
exports.globalErrorHadler = function(err, req, res, next) {
    //check error is mongoose validation error
    if(err.name && err.name == "ValidationError") {
        const formattedError = formattedMongooseValidatorErrorFunc(err);
        return res.status(400).json({errors:formattedError});
    }
    // moongoose unqiue validator error
    else if(err.code && err.code ==11000) {
        let formattedErr = Object.entries(err.keyValue)[0];
        return res.status(400).json({errors:{[formattedErr[0]]: formattedErr[1]+' '+'exists already'}});
    }
    else{
    console.log(err);
    return res.status(err.status || HTTP_SERVER_ERROR).end();
    }
}