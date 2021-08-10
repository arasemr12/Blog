const passport = require('passport');
const Strategy = require('passport-local');
const db = require('../models/user');


module.exports = function () {
  passport.use(new Strategy(function (username, password, cb) {
    db.find({ username: username }).then((result) => {
      if (result[0]) {
        if (result[0].password === password) {
          var user = {
            id: result[0]._id,
            username: result[0].username,
            name: result[0].name,
            ip: result[0].ip,
            profile: result[0].profile
          };
          return cb(null, user);
        } else {
          return cb(null, false, { message: 'Incorrect username or password.' });
        }
      } else {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
    });
  }));

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id, username: user.username, name: user.name, ip: user.ip, profile: user.profile });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

};