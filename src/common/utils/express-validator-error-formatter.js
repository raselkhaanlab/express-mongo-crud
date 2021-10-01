const { set } = require("mongoose");

function expressValidatorErrFormatter(errors) {
    errors = errors.array();
    let errorObject = {};
    for(let i=0;i<errors.length;i++){
        if(!errorObject[errors[i].param]){
           errorObject[errors[i].param]=errors[i].msg;
        }
    }
    return errorObject;
}
module.exports = {
    expressValidatorErrFormatter
};

  