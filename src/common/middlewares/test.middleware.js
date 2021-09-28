function test(req,res,next) {
    console.log('test midlleware called');
    return next();
}
module.exports = test;