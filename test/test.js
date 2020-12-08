// const request = require('request');
const request = require('supertest');
const mongoose = require('mongoose');
const UserModel = require('../models/users');
const { randomString } = require('../utils/utils');

var session = require('supertest-session');
const app = require('../app');

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
  await mongoose.connection.close();
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
  test("Register User - 200 Response", done => {
    request.post({ url: url + '/user', form: registerMock }, function (err, res, body) {
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
    request.post({ url: url + '/user', form: registerMockInvalidEmail }, function (err, res, body) {
      try {
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.body).error).toBe('Invalid Email');
        done();
        UserModel.deleteOne({ email: registerMockInvalidEmail.email }, function (err, data) { })
      } catch (error) {
        done(error);
      }
    })
  });

  test("Register User with existing email- 400 Response", done => {
    var user = new UserModel(registerMockDuplicate);
    user.save(function (err, data) {
      request.post({ url: url + '/user', form: registerMockDuplicate }, function (err, res, body) {
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

  beforeEach( async () => {
    var user = new UserModel(registerMock);
    await user.save(function (err, data) { });
  });

  afterEach( async () => {
    await UserModel.deleteOne({ email: registerMock.email }, function (err, data) { })
  });

  test("Login User - 200 response", done => {
    request.post({ url: url + '/auth/login', form: loginMock }, function (error, res, body) {
      try {
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
        expect(JSON.parse(res.body).error.toBe('email or password incorrect'));
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
        expect(JSON.parse(res.body).error.toBe('email or password incorrect'));
        done();
      } catch (error) {
        done(error);
      }
    });
  })

  test("Login User(email not verified) - 400 response", done => {
    UserModel.updateOne({email: loginMock.email}, {$set: {isVerified: false}}, function(err, data) { });
    request.post({ url: url + '/auth/login', form: loginMock }, function (error, res, body) {
      try {
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.body).error.toBe('email not verified'));
        done();
      } catch (error) {
        done(error);
      }
    });
  })
});

describe.only("Session with restricted route", () => {

  beforeEach(async () => {
    var user = new UserModel(registerMock);
    await user.save();
    testSession = session(app);
  });

  afterEach(async () => {
    await UserModel.deleteOne({ email: registerMock.email });
  });

  

  test("Assessing logged in router without login", done => {
    request(app)
      .post('/api/auth/restricted')
      .expect(400)
      .end(function (err, res) {
        if (err) done(err);
        try {
          expect(res.body.message).toBe('User not logged in');
          done();
        } catch (error) {
          done(error);
        }
      });
  })

  test.only("Assessing logged in router after login", done => {
    testSession.post('/api/auth/login')
      .send(loginMock)
      .expect(200)
      .end(function (err, res) {
        if (err) done(err);
        testSession.post('/api/auth/restricted')
          .expect(200)
          .end(function (err, res) {
            if (err) done(err);
            try {
              expect(res.body.message).toBe('This is logged in view');
              done();
            } catch (error) {
              done(error);
            }
          });
      });
  })

  test("Logout test ssessing logged in router after login and then logout", done => {
    request(app)
      .post('/api/auth/login')
      .send(loginMock)
      .expect(200)
      .end(function (err, res) {
        if (err) done(err);
        request(app)
          .get('/api/auth/logout')
          .expect(200)
          .end(function (err, res) {
            if (err) done(err);
            request(app)
              .post('/api/auth/restricted')
              .expect(400)
              .end(function (err, res) {
                if (err) done(err);
                try {
                  expect(res.body.message).toBe('User not logged in');
                  done();
                } catch (error) {
                  done(error);
                }
              });
          });
      });
  })

  // test("Assessing logged in router after login", done => {
  //   let cookie = request.jar()
  //   request.post({ url: url + '/auth/login', jar: cookie, headers: { "Accept": "application/json" }, form: registerMock }, function (err, res, body) {
  //     request.post({ url: url + '/auth/restricted', jar: cookie }, function (error, res, body) {
  //       try {
  //         expect(res.statusCode).toBe(200);
  //         expect(JSON.parse(res.body).message).toBe('This is logged in view');
  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  //   })
  // });

  // test("Logout test ssessing logged in router after login and then logout", done => {
  //   let cookie = request.jar()
  //   request.post({ url: url + '/auth/login', jar: cookie, headers: { "Accept": "application/json" }, form: registerMock }, function (err, res, body) {
  //     request.get({ url: url + '/auth/logout', jar: cookie, headers: { "Accept": "application/json" }}, function(err, res, body) {
  //       request.post({ url: url + '/auth/restricted', jar: cookie, }, function (error, res, body) {
  //         try {
  //           expect(res.statusCode).toBe(400);
  //           expect(JSON.parse(res.body).message).toBe('User not logged in');
  //           done();
  //         } catch (error) {
  //           done(error);
  //         }
  //       });
  //     })
  //   })
  // });
});