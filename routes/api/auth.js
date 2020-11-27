var express = require('express');
var router = express.Router();

router.post('/login', function (req, res, next) {
    res.send('User loggged in successfully');
});

router.get('/logout', function (req, res, next) {
    res.send('User loggged out successfully');
});

router.post('/signup', function (req, res, next) {
    res.send('User signed up successfully');
});

router.get('/verify_email', function (req, res, next) {
    res.send('email verification done successfully');
});

module.exports = router;