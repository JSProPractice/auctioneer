var express = require('express');
var router = express.Router();
const userService = require('../../services/user');

//Create user
router.post('/',async function(req, res, next){
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let dob = req.body.dob;

    let response = await userService.registerUser(name, email, password, dob);

    res.send(response);
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