const path = require('path');
const express = require('express');
const dotEnv = require('dotenv');
const cors = require('cors');
dotEnv.config();
const responseInterceptor = require('./common/interceptors/jsonResponse.interceptor');
const app = express();
app.disable("x-powered-by");
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,'views'));
app.use(cors());
app.use(express.static(path.join(__dirname,'..','public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(responseInterceptor);

module.exports= {app};





