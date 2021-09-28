
function convert(req,res,args) {
    let port=req.socket.localPort;
    if(port == 80 || port == 443) {
        port='';
    }
    else port= ':'+port;
   
    let return_data = {
        time:new Date().toString(),
        url:req.protocol+'://'+req.hostname+port+req.originalUrl
    };
    
    if(args &&  args.statusCode ) {
        return_data.statusCode = args.statusCode;
        delete args.statusCode;
    }
    else {
        return_data.statusCode = res.statusCode;
    }

    if(args && args.errors) {
        return_data.errors = args.errors;
        delete args.errors;
    }
    else{
        return_data.data = args;
    }
    return JSON.stringify(return_data);
}

function modifyResponseBody(req, res, next) {
    sendFn = res.send;
    res.json = function(data){
        res.status(res.statusCode);
        res.type('json');
        arguments[0] = convert(req,res,arguments[0]);
        sendFn.apply(res, arguments);
    }
    next();
};
module.exports = modifyResponseBody;