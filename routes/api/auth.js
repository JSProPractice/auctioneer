var express = require('express');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
const mangoose = require('mongoose');
const User = mangoose.model('User');
const { login, logout, isLoggedIn } = require('../../services/auth');

const userService = require('../../services/user');

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

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
            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log('Local strategy returned true')
            return done(null, user);
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

router.post('/login', function(req, res, next){
    login(req, res, next);
})

router.get('/logout', function (req, res, next) {
    logout(req, res, next);
});

router.post('/restricted', isLoggedIn, function (req, res, next) {
    res.send({status: 'success', message:'This is logged in view'});
});

router.post('/signup', async function (req, res, next) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let dob = req.body.dob;

    let response = await userService.registerUser(name, email, password, dob);

    res.send(response);
});

router.get('/verify_email', function (req, res, next) {
    res.send('email verification done successfully');
});

module.exports = router;