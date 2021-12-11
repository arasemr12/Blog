require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const LevelStore = require('level-session-store')(session);
//By Emrah#9891

const IndexRoute = require('./routes/index');
const PostRoute = require('./routes/Post');
const UserRoute = require('./routes/User');

const app = express();

require('./boot/auth')();

app.set('trust proxy',true);

app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.json());
app.use(session({
  store: new LevelStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.authenticate('session'));
app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.req = req;
  res.locals.user = req.user;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  if(req.user && !req.user.profile){
    req.user.profile = '/uploads/blank-profile.webp';
  }
  next();
});

app.set('view engine','ejs');
app.use(expressLayouts);

app.set('layout','layouts/main');

app.use('/',IndexRoute);
app.use('/posts/',PostRoute);
app.use('/users/',UserRoute);

const PORT = process.env.PORT || 3000;
require('./boot/db').then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)));
