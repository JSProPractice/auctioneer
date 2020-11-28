const request = require('request');
const mongoose = require('mongoose');
const UserModel = require('../models/users');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true );

function randomString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let url = 'http://localhost:3000/api/auth';

mongoose.connect('mongodb://localhost/auctioneer').then(() => {

}).catch(err => {
  console.log('Error', err);
})

afterAll(async () => {
  await mongoose.connection.close()
});

var registerMock = {
  name: 'pintu' + randomString(3),
  email: randomString(5) + '@gmail.com',
  password: 'pintu123'
}

var registerMockInvalidEmail = {
  name: 'Pintu' + randomString(3),
  email: 'pintu' + randomString(5) + '@gmail',
  password: 'pintu123'
}

var registerMockForEmailNotVerified = {
  name: 'Pintu' + randomString(3),
  email: 'pintu' + randomString(5) + '@gmail',
  password: 'pintu123',
  isVerified: true
}

var registerMockDuplicate = {
  name: 'pintu',
  email: 'pintupandit2970@gmail.com',
  password: 'pintu123'
}

var loginMock = {
  username: registerMock.username,
  password: registerMock.password
}

UserModel.create(registerMockDuplicate, function (err, data) {
  if (err) return handleError(err);
})

describe("Load the test", () => {
  test("Register User - 200 Response", () => {
    request.post({ url: url + '/user', form: registerMock }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      UserModel.deleteOne({ email: registerMock.email }, function (err, data) { })
    })
  });

  test("Register User with invalid email- 400 Response", () => {
    request.post({ url: url + '/user', form: registerMock }, function (err, res, body) {
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).error).toBe('Invalid Email');
      UserModel.deleteOne({ email: registerMockInvalidEmail.email }, function (err, data) { })
    })
  });

  test("Register User with existing email- 400 Response", () => {
    request.post({ url: url + '/user', form: registerMock }, function (err, res, body) {
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).error).toBe('Email already taken');
      UserModel.deleteOne({ email: registerMockDuplicate.email }, function (err, data) { })
    })
  });

  test("Login User - 200 response", () => {
    request.post({ url: url + '/user', form: registerMock }, function (error, response, body) {
      request.post({ url: url + '/user/login', form: loginMock }, function (error, response, body) {
        expect(res.statusCode).toBe(200);
        UserModel.deleteOne({ email: registerMock.email }, function (err, data) { })
      });
    })
  })

  test("Login User with incorrect email - 400 response", () => {
    request.post({ url: url + '/user', form: registerMock }, function (error, response, body) {
      request.post({ url: url + '/user/login', form: loginMock }, function (error, response, body) {
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.body).error.toBe('email or password incorrect'));
        UserModel.deleteOne({ email: registerMock.email }, function (err, data) { })
      });
    })
  })

  test("Login User wint incorrect password - 400 response", () => {
    request.post({ url: url + '/user', form: registerMock }, function (error, response, body) {
      request.post({ url: url + '/user/login', form: loginMock }, function (error, response, body) {
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.body).error.toBe('email or password incorrect'));
        UserModel.deleteOne({ email: registerMock.email }, function (err, data) { })
      });
    })
  })

  test("Login User(email not verified) - 400 response", () => {
    request.post({ url: url + '/user', form: registerMockForEmailNotVerified }, function (error, response, body) {
      request.post({ url: url + '/user/login', form: loginMock }, function (error, response, body) {
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.body).error.toBe('email not verified'));
        UserModel.deleteOne({ email: registerMockForEmailNotVerified.email }, function (err, data) { })
      });
    })
  })
});