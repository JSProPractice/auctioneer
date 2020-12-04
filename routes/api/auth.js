var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { login, logout, isLoggedIn } = require('../../services/auth');

const userService = require('../../services/user');
const saltRounds = 10;

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

    let hash = await bcrypt.hash(password, saltRounds);
    let response = await userService.registerUser(name, email, hash, dob);

    res.send(response);
});

router.get('/verify_email', function (req, res, next) {
    res.send('email verification done successfully');
});

module.exports = router;