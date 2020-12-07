var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const mangoose = require('mongoose');
const User = mangoose.model('User');
let bcrypt = require('bcrypt');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
  },
  function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password, function(err, result){
        if(!result) {
          return done(null, false, { message: 'Incorrect password.' });
        } else {
          console.log('Local strategy returned true')
          return done(null, user);
        }
      })
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});