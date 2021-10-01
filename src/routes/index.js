const {app} = require('./../app');
const {globalErrorHadler} = require('./../common/middlewares/errorhadler.middleware');
const productRoute = require('../modules/product/product.routes');
const authRoute = require("./../modules/auth/auth.route");
const userRoute = require('./../modules/user/user.routes');
const authMiddleware = require('./../modules/auth/auth.middleware');

//==== application routing =====
exports.init= (app)=> {
    app.use((req,res,next)=>{
        console.log({
            url:req.originalUrl,
            method:req.method
        });
        return next();
    })
    app.use('/api/v1.0/products', productRoute);
    app.use('/auth',authRoute);
    app.use('/users',userRoute);
    app.get('/favicon.ico', (req, res) => {return res.status(204).end()});
    app.get('/products',authMiddleware.isLogin,(req,res)=>res.render('product'));
    app.get('/',authMiddleware.isLogout,(req,res)=>{
        const email = req.session && req.session.email;
        const password = req.session && req.session.password;
        return res.render('home',{
            email:email,
            password:password
        })
    });
    //global error handler
    app.use(globalErrorHadler);
};