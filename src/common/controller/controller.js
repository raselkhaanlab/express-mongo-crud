
exports.home = (req,res,next) =>{
    try{
        const email = req.session && req.session.email;
        const password = req.session && req.session.password;
        return res.render('home',{
            email:email,
            password:password
        });
    }
    catch(e) {
        return next(e);
    }
}
exports.dashboard = (req,res,next) =>{
    try{
        return res.render('dashboard');
    }
    catch(e) {
        return next(e);
    }
}