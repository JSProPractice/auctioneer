var express = require('express');
var router = express.Router();

const userService = require('../../services/user');

router.post('/login', function (req, res, next) {
    res.send('User loggged in successfully');
});

router.get('/logout', function (req, res, next) {
    res.send('User loggged out successfully');
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