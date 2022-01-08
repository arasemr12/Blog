const passport = require('passport');
const Strategy = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models/user');


module.exports = function () {
  passport.use(new Strategy(function (username, password, cb) {
    db.find({ username: username }).then((result) => {
      if (result[0]) {
        bcrypt.compare(password, result[0].password,(err,im) => {
          if(err) return console.log(err);
          if(im){
            return cb(null, result[0]);
          }else{
            return cb(null, false, { message: 'Incorrect username or password.' });
          }
        })
      } else {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
    });
  }));

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, user);
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

};