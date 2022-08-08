const User = require('./model/User');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { usernameField: 'findBy' },
      (username, password, done) => {
        User.findOne({ name: username }, (err, user) => {
          if (err) throw err;
          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      }
    )
  );

  passport.serializeUser(({ name, email, _id }, cb) => {
    console.log('ser');
    const id = _id.toString();
    const userInfo = { name, email, id };
    cb(null, userInfo);
  });
  passport.deserializeUser((user, cb) => {
    console.log('deser');
    cb(err, user);
  });
};
