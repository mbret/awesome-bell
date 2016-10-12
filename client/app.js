var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var _ = require('lodash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MPlayer = require("mplayer");
var config = require("./config");
var localConfig = {};
var app = express();
try {
    localConfig = require("./config.local");
} catch (e) {
    // silent
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/js", express.static(path.join(__dirname, 'node_modules')));

app.locals.config = config;
_.merge(app.locals.config, localConfig);
app.locals.mPlayer = new MPlayer({debug: false, verbose: false});
app.locals.playing = false;

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

require("./alarm-hook")(app);

module.exports = app;
