var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { login, logout, isLoggedIn } = require('../../services/auth');

const userService = require('../../services/user');
const saltRounds = 10;

let errorToErrorMsgMap = {
    // "not_registered": "User is not registered",
    "email_not_verified": "Please verify your email",
    "login_failied": "Email or password incorrect",
    "user_logged_in": "User loggged in successfully",
    
    "duplicate_key": "Email already exist",
    "unable_to_save_user":"Unable to save user",
    "user_created":"User created successfully",
    "invalid_email_address":"Invalid email address"
};

router.post('/login', async function (req, res, next) {
    login(req, res, next);
});

router.get('/logout', function (req, res, next) {
    logout(req, res, next);
});

router.post('/signup', async function (req, res, next) {
    let name = req.body.name;
    let email = req.body.email.trim().toLowerCase();
    let password = req.body.password;
    let dob = req.body.dob;
    let hash = await bcrypt.hash(password, saltRounds);
    let response = await userService.registerUser(name, email, hash, dob);

    res.send(response);
});

router.post('/restricted', isLoggedIn, function (req, res, next) {
    res.send({ status: 'success', message: 'This is logged in view' });
});

router.get('/verify_email', async function (req, res, next) {
    let userId = req.query.userId;
    let token = req.query.token;
    console.log('req', req.query)
    let response = await userService.veryfyEmail(userId, token);

    res.send(response);
});

module.exports = router;