var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const passport = require('passport');

var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/test_auctioneer',
  collection: 'mySessions'
}, function (error) {
  console.log('err', error);
});

store.on('error', function (error) {
  console.log(error);
});

//registering mongoose models
require('./models/users');
require('./models/auctions');
require('./models/token');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var dbService = require('./services/db');


var app = express();

app.use(session({
  // cookie: { secure: true, maxAge: 6000 },
  secret: 'Its Secret',
  store: store,
  resave: false,
  saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//registering passport
require('./services/passport');

dbService.connect();
app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.use('/api',apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.send(err.message);
});

module.exports = app;
