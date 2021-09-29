
const http = require('http');
const {app} = require('./app');
const conf = require('./config');
const routes =require('./routes');
const mongoose = require("mongoose");

const mongoUrl= conf.mongodb.url;
mongoose.set('runValidators', true);
mongoose.connect(mongoUrl, {useNewUrlParser: true,serverSelectionTimeoutMS:15000});
mongoose.connection
.once('open',()=>{
    console.log('connected to mongodb successfully');
    routes.init(app);
    const server = http.createServer(app);
    server.listen(conf.port,()=>{
        const host = server.address().address;
        const port = server.address().port;
        console.log('running at http://' + host + ':' + port);
    });

    server.on("error",(error)=>{
        let errCode = error.code ;
        if(errCode && errCode =="EADDRINUSE") {
            console.error(`port: ${conf.port} already in use.`);
            process.exit(1);
        }
        throw error;
    });
})
.on('error',(e)=>{
    console.log("Mongo Connection Error->",e);
    process.exit(1);
});

