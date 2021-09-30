const path = require('path');
const express = require('express');
const dotEnv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
dotEnv.config();
const responseInterceptor = require('./common/interceptors/jsonResponse.interceptor');
const app = express();
app.disable("x-powered-by");
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,'views'));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname,'..','public')));
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(flash());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(responseInterceptor);

module.exports= {app};





