const request = require('request');
const mongoose = require('mongoose');
const UserModel = require('../models/users');
const { randomString } = require('../utils/utils');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true );

let url = 'http://localhost:3000/api';


beforeAll(() => {
  mongoose.connect('mongodb://localhost/test_auctioneer').then(() => {
  }).catch(err => {
    console.log('Error', err);
  })
});

afterAll(async () => {
  await mongoose.connection.close()
});

var registerMock = {
  name: 'pintu' + randomString(3),
  email: randomString(5).toLowerCase() + '@gmail.com',
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
  name: 'Alex' + randomString(3),
  email: 'alex' + randomString(5).toLowerCase() + '@gmail.com',
  password: 'alex123',
  isVerified: true
}

var loginMockWrongEmail = {
  email: randomString(3) + loginMock.email,
  password: loginMock.password
}

var loginMockWrongPassword = {
  email: loginMock.email,
  password: randomString(3) + loginMock.password
}

describe("Sign Up Module", () => {
  test("Register User - 200 Response", done => {
    request.post({ url: url + '/auth/signup', form: registerMock }, function (err, res, body) {
      try {
        expect(res.statusCode).toBe(200);
        done();
        UserModel.deleteOne({ email: registerMock.email }, function (err, data) { })
      } catch (error) {
        done(error);
      }
    })
  });

  test("Register User with invalid email- 400 Response", done => {
    request.post({ url: url + '/auth/signup', form: registerMockInvalidEmail }, function (err, res, body) {
      try {
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.body).error).toBe('Invalid email address');
        done();
        UserModel.deleteOne({ email: registerMockInvalidEmail.email }, function (err, data) { })
      } catch (error) {
        done(error);
      }
    })
  });

  test.only("Register User with existing email- 400 Response", done => {
    var user = new UserModel(registerMockDuplicate);
    user.save(function (err, data) {
      request.post({ url: url + '/auth/signup', form: registerMockDuplicate }, function (err, res, body) {
        try {
          expect(res.statusCode).toBe(400);
          expect(JSON.parse(res.body).error).toBe('Email already exist');
          done();
          UserModel.deleteOne({ email: registerMockDuplicate.email }, function (err, data) { })
        } catch (error) {
          done(error);
        }
      })
    });
  });
});

describe("Log in Module", () => {

  beforeEach(async () => {
    console.log('going to save user to DB');
    var user = new UserModel(loginMock);
    await user.save();
    console.log('User saved to DB');
  });

  afterEach( async () => {
    await UserModel.deleteOne({ email: loginMock.email })
    console.log('User Deleted');
  });

  test("Login User - 200 response", done => {
    request.post({ url: url + '/auth/login', form: loginMock }, function (error, res, body) {
      try {
        console.log('Response received');
        expect(res.statusCode).toBe(200);
        done();
      } catch (error) {
        done(error);
      }
    });

  })

  test("Login User with incorrect email - 400 response", done => {
    request.post({ url: url + '/auth/login', form: loginMockWrongEmail }, function (error, res, body) {
      try {
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.body).error).toBe('Email or password incorrect');
        done();
      } catch (error) {
        done(error)
      }
    });
  })

  test("Login User with incorrect password - 400 response", done => {
    request.post({ url: url + '/auth/login', form: loginMockWrongPassword }, function (error, res, body) {
      try {
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.body).error).toBe('Email or password incorrect');
        done();
      } catch (error) {
        done(error);
      }
    });
  })

  test("Login User(email not verified) - 400 response", done => {
    UserModel.updateOne({ email: loginMock.email }, { $set: { isVerified: false } }, function (err, data) {
      request.post({ url: url + '/auth/login', form: loginMock }, function (error, res, body) {
        try {
          expect(res.statusCode).toBe(400);
          expect(JSON.parse(res.body).error).toBe('Please verify your email');
          done();
        } catch (error) {
          done(error);
        }
      });
     });
  })
});