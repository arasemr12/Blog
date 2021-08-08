const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
//By Emrah#0001

const IndexRoute = require('./routes/index');
const PostRoute = require('./routes/Post');
const UserRoute = require('./routes/User');

const app = express();

require('./boot/db')();
require('./boot/auth')();

app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});
app.use(passport.initialize());
app.use(passport.authenticate('session'));

app.set('view engine','ejs');
app.use(expressLayouts);

app.set('layout','layouts/main');

app.use('/',IndexRoute);
app.use('/posts/',PostRoute);
app.use('/users/',UserRoute);

app.listen(process.env.PORT,() => console.log('App started!'));