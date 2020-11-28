var express = require('express');
var router = express.Router();

//Create user
router.post('/',function(req, res, next){
    res.send('User created');
});

//Read user
router.get('/:id',function(req, res, next){
    res.send('user found');
});
//Update user
router.put('/:id',function(req, res, next){
    res.send('User updated successfully');
});

//Delete user
router.delete('/:id',function(req, res, next){
    res.send('User deleted successfully');
});

//List users
router.get('/',function(req, res, next){
    res.send('All users listed successfully');
});

module.exports = router;