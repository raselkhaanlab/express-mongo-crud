
exports.isLogin = function (req,res,next) {
    const isLogin = req.session.isLogin;
    const isXhr = req.xhr;

    if(isLogin) {
        res.locals.user = req.session.user;
        return next();
    }
    else {
        if(isXhr) {
            return res.status(401).json({error:'Unauthorize'});
        }
        else {
            return res.redirect('/');
        }
    }
}

exports.isLogout = function (req,res,next) {
    const isLogin = req.session.isLogin;
    const isXhr = req.xhr;

    if(isLogin) {
        if(isXhr) {
            return res.status(400).json({error:'BadRequest'});
        }
        else {
            return res.redirect('/dashboard');
        }
    }
    else {
        return next();
    }
}