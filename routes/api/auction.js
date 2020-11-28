var express = require('express');
var router = express.Router();

//Create auction 
router.post('/',function(req, res, next){
    res.send('Auction created');
});

//Read auction
router.get('/:id',function(req, res, next){
    res.send('auction found');
});
//Update auction
router.put('/:id',function(req, res, next){
    res.send('auction details updated successfully');
});

//Delete auction
router.delete('/:id',function(req, res, next){
    res.send('Auction deleted successfully');
});

//List auction
router.get('/',function(req, res, next){
    res.send('All auctions listed successfully');
});

module.exports = router;