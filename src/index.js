
const http = require('http');
const {app} = require('./app');
const conf = require('./config');
const routes =require('./routes');

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