var express = require('express');
var router = express.Router();

//Create token 
router.post('/',function(req, res, next){
    res.send('Token created');
});

//Read token
router.get('/:id',function(req, res, next){
    res.send('token found');
});
//Update token
router.put('/:id',function(req, res, next){
    res.send('token details updated successfully');
});

//Delete token
router.delete('/:id',function(req, res, next){
    res.send('token deleted successfully');
});

//List token
router.get('/',function(req, res, next){
    res.send('All tokens listed successfully');
});

module.exports = router;