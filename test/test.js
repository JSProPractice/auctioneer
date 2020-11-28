const request = require('request');
const mongoose = require('mongoose');
const UserModel = require('../models/users');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true );

mongoose.connect('mongodb://localhost/auctioneer').then( () => {
  
}).catch( err => {
  console.log('Error', err);
})

UserModel.deleteOne({ email: "pintupandit2970@gmail.com" }, function (err, data) { })

describe("Load the test", () => {
  test("dummy test", () => {
    console.log('dummy test');
  });
  mongoose.connection.close()
});