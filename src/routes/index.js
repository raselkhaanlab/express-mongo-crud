const {app} = require('./../app');
const productRoute = require('../modules/product/product.routes');

//==== application routing =====
exports.init= (app)=> {
    app.use('/api/v1.0/products',productRoute);
    app.get('/favicon.ico', (req, res) => {return res.status(204).end()});
    app.get('/',(req,res)=>res.render('index'));
};
