var express = require('express');
var router = express.Router();

const userService = require('../../services/user');

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
    console.log('req.body', req.body);
    let email = req.body.email.trim().toLowerCase();
    let password = req.body.password;

    console.log('email', email.length);

    let response = await userService.loginCredentialsVerification(email, password);
    console.log('response.msg ', response.msg);
    console.log('errorToErrorMsgMap[response.msg] ', errorToErrorMsgMap[response.msg]);

    if (response.success) {
        return res.status(200).json({ 'success': true, 'msg': errorToErrorMsgMap[response.msg] });
    }
    return res.status(400).json({ 'success': false, 'error': errorToErrorMsgMap[response.msg] });
});

router.get('/logout', function (req, res, next) {
    res.send('User loggged out successfully');
});

router.post('/signup', async function (req, res, next) {
    let name = req.body.name;
    let email = req.body.email.trim().toLowerCase();
    let password = req.body.password;
    let dob = req.body.dob;

    let response = await userService.registerUser(name, email, password, dob);
    console.log('response.msg ', response.msg);
    console.log('errorToErrorMsgMap[response.msg] ', errorToErrorMsgMap[response.msg]);
    if (response.success) {
        return res.status(200).json({ 'success': true, 'msg': 'Signed up successfully' });
    }
    return res.status(400).json({ 'success': false, 'error': errorToErrorMsgMap[response.msg] });
});

router.get('/verify_email', async function (req, res, next) {
    let userId = req.query.userId;
    let token = req.query.token;
    console.log('req', req.query)
    let response = await userService.veryfyEmail(userId, token);

    res.send(response);
});

module.exports = router;