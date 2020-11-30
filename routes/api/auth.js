var express = require('express');
var router = express.Router();

const userService = require('../../services/user');

router.post('/login', async function (req, res, next) {
    let email = req.body.email.trim().toLowerCase();
    let password = req.body.password;
    console.log('req.body',req.body);
    console.log('email',email.length);

    let response = await userService.loginCredentialsVerification(email, password);
    res.send(response);
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

    res.send(response);
});

router.get('/verify_email', async function (req, res, next) {
    let userId = req.query.userId;
    let token = req.query.token;
    console.log('req',req.query)
    let response = await userService.veryfyEmail(userId, token);

    res.send(response);
});

module.exports = router;