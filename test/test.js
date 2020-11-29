const request = require('request');
const mongoose = require('mongoose');
const UserModel = require('../models/users');
const randomString = require('../utils/randomString');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true );

let url = 'http://localhost:3000/api';


beforeAll(() => {
  mongoose.connect('mongodb://localhost/auctioneer').then(() => {
  }).catch(err => {
    console.log('Error', err);
  })
});

afterAll(async () => {
  await mongoose.connection.close()
});

var registerMock = {
  name: 'pintu' + randomString(3),
  email: randomString(5) + '@gmail.com',
  password: 'pintu123',
  isVerified: true
}

var registerMockInvalidEmail = {
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
  email: registerMock.email,
  password: registerMock.password
}

var loginMockWrongEmail = {
  email: randomString(3) + registerMock.email,
  password: registerMock.password
}

var loginMockWrongPassword = {
  email: registerMock.username,
  password: randomString(3) + registerMock.password
}

describe("Sign Up Module", () => {
  test("Register User - 200 Response", () => {
    request.post({ url: url + '/user', form: registerMock }, function (err, res, body) {
      expect(res.statusCode).toBe(200);
      UserModel.deleteOne({ email: registerMock.email }, function (err, data) { })
    })
  });

  test("Register User with invalid email- 400 Response", () => {
    request.post({ url: url + '/user', form: registerMockInvalidEmail }, function (err, res, body) {
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).error).toBe('Invalid Email');
      UserModel.deleteOne({ email: registerMockInvalidEmail.email }, function (err, data) { })
    })
  });

  test("Register User with existing email- 400 Response", () => {
    var user = new UserModel(registerMockDuplicate);
    user.save(function (err, data) {
      if (err) return console.error(err);
    });
    request.post({ url: url + '/user', form: registerMockDuplicate }, function (err, res, body) {
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).error).toBe('Email already exist');
      UserModel.deleteOne({ email: registerMockDuplicate.email }, function (err, data) { })
    })
  });
});

describe("Log in Module", () => {

  beforeEach(() => {
    var user = new UserModel(registerMock);
    user.save(function (err, data) {
      if (err) return console.error(err);
    });
  });

  afterEach(() => {
    UserModel.deleteOne({ email: registerMock.email }, function (err, data) { })
  });

  test("Login User - 200 response", () => {
    request.post({ url: url + '/auth/user/login', form: loginMock }, function (error, response, body) {
      expect(res.statusCode).toBe(200);
    });
  })

  test("Login User with incorrect email - 400 response", () => {
    request.post({ url: url + '/auth/user/login', form: loginMockWrongEmail }, function (error, response, body) {
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).error.toBe('email or password incorrect'));
    });
  })

  test("Login User with incorrect password - 400 response", () => {
    request.post({ url: url + '/auth/user/login', form: loginMockWrongPassword }, function (error, response, body) {
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).error.toBe('email or password incorrect'));
    });
  })

  test("Login User(email not verified) - 400 response", () => {
    UserModel.update({email: loginMock.email}, {$set: {isVerified: false}}, function(err, data) { });
    request.post({ url: url + '/auth/user/login', form: loginMock }, function (error, response, body) {
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).error.toBe('email not verified'));
    });
  })
});