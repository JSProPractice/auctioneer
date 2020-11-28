var express = require('express');
var user = require('./user');
var auth = require('./auth');
var token = require('./token');
var auction = require('./auction');

var router = express.Router();



router.use('/user',user);
router.use('/auth',auth);
router.use('/token',token);
router.use('/auction',auction);

module.exports = router;