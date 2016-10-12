var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var config = require("./config");
var _ = require("lodash");
var localConfig = {};
var app = express();
try {
    localConfig = require("./config.local");
    console.log(localConfig);
} catch (e) {
    // silent
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/js", express.static(path.join(__dirname, '../node_modules')));

app.use('/', routes);

_.merge(config, localConfig);
app.locals.config = config;
app.locals.sleepMode = false;

// check admin password
if (!app.locals.config.adminPassword) {
    console.error("Please set an admin password before start the server.");
    process.exit();
}

// apply host alias
if (app.locals.config.hostAlias.length > 0) {
    app.locals.config.hostAlias = "/" + app.locals.config.hostAlias;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});


module.exports = app;
