var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var express = express();

// view engine setup
express.set('views', path.join(__dirname, 'views'));
express.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//express.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
express.use(logger('dev'));
express.use(bodyParser.json());
express.use(bodyParser.urlencoded({ extended: false }));
express.use(cookieParser());
express.use(express.static(path.join(__dirname, 'public')));

express.use('/', routes);

// catch 404 and forward to error handler
express.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (express.get('env') === 'development') {
  express.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
express.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = express;
