'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
//var flash = require('connect-flash');

var helpers = require('view-helpers');
var compression = require('compression');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
//var sessionMiddleware = require('./middlewares/session');
var config = require('./config');
var winston = require('./winston');


require('./../app/utils/route-group');

module.exports = function(app) {

    winston.info('Initializing Express');

    app.set('showStackError', true);
    //Prettify HTML
    app.locals.pretty = true;

    //Should be placed before express.static
    app.use(compression({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));


    //Setting the fav icon and static folder
    //app.use(favicon(config.root + '/public/images/icons/favicon.ico'));
    app.use(express.static(config.root + '/public'));

    //Don't use logger for test env
    if (config.NODE_ENV !== 'test') {
        app.use(logger('dev', { "stream": winston.stream }));
    }

    //Set views path, template engine and default layout
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'ejs');

    //Enable jsonp
    app.enable("jsonp callback");

    //cookieParser should be above session
    app.use(cookieParser());

    // request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    //express session configuration
    //app.use(sessionMiddleware);


    //connect flash for flash messages
    //app.use(flash());

    //dynamic helpers
    app.use(helpers(config.app.name));

    //use passport session
    //app.use(passport.initialize());
    //app.use(passport.session());


    app.all('/*', function(req, res, next) {
        winston.info('********* REQUEST HEADERS***********');
        winston.info(req.headers);
        winston.info('********* REQUEST BODY***********');
        winston.info(req.body);
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

    // Auth Middleware - This will check if the token is valid
    // Only the requests that start with /api/v1/* will be checked for the token.
    // Any URL's that do not follow the below pattern should be avoided unless you 
    // are sure that authentication is not needed
    // app.all('/api/v1/*', [require('./middlewares/validateRequest')]);


    // Globbing routing files
    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
        require(path.resolve(routePath))(app, express);
    });

    app.use('*',function(req, res){
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });

    app.use(function(err, req, res, next) {

        //Log it
        winston.error(err);

        //Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

    winston.info('Express done');



};
