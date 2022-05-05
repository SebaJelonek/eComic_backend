const User = require('./model/User');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'findBy' },
      (username, password, done) => {
        User.login(username, password).then((user) => {
          if (!user.name) {
            return done(user, false);
          } else {
            return done(null, user);
          }
        });
      }
    )
  );

  passport.serializeUser((user, callback) => {
    callback(null, user);
  });
  passport.deserializeUser((id, callback) => {
    User.findById(id, (err, user) => {
      callback(err, user);
    });
  });
};
