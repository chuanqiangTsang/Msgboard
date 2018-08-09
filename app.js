var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var updateRouter = require('./routes/update');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// 引入session
const session = require("express-session");
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/update', updateRouter);

const api = require('./routes/api')

// 登录
app.get('/dologin', api.dologin)
app.get('/doregister', api.doregister)
app.get('/dologout', api.dologout)
app.get('/doAddMsg', api.doAddMsg)
app.get('/doGetMsg', api.doGetMsg)
app.get('/doGetMsgById', api.doGetMsgById)
app.get('/doUpdateMsg', api.doUpdateMsg)
app.get('/doDelMsg', api.doDelMsg)



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
  res.render('error');
});

module.exports = app;
