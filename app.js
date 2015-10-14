"use strict";

var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    AWS = require('aws-sdk');

// Auth middleware, can now be used on a per request basis
var auth = require(path.join(__dirname, '/middleware/authenticate'));
var authenticate = auth({ jwtTokenSecret: 'jwttoken', restrict: false });
var restrict = auth({ jwtTokenSecret: 'jwttoken', restrict: true });

// Please put your own credentials here
AWS.config.update({
  accessKeyId: 'id',
  secretAccessKey: 'key'
});

/**
  CONSUMER - Ideally this could live as a seperate service simply consuming
    and acting on messages.
  BROADCASTER - This is a singleton instance of broadcaster used to send messages
    to SQS, as you might imagine the API can used this to communicate to services.
**/
var consumer = require(path.join(__dirname, '/services/consumer'));
var broadcaster = require(path.join(__dirname + '/broadcasters/broadcaster'));

var app = express();

/**
  Here is an example of passing low priority tasks to queues such as amazon SQS.
  An example to recalculate trending score of an article for every page view.
  To be RESTful we can route this based on resource e.g. PUT /articles/:id/view
**/
app.put('/view', function(req, res, next) {

  var params = {
    MessageBody: new Date().getTime(),
    DelaySeconds: 0
  };

  broadcaster.sendMessage(params, function (err, data) {
    if (err) {
      return next(err);
    }

    return res.status(200).json("sqs has been sent :", JSON.stringify(data));
  });

});

/**
  Token will be checked by middleware but it doesn't need to be present,
    useful if you need to load the user to update a log etc, optional session.
**/
app.get('/notstrict', authenticate, function(req, res, next) {
  return res.status(200).json("You made it");
});

/**
  We need to have Bearer hiddentoken as an Authorisation header
**/
app.get('/strict', restrict, function(req, res, next) {
  return res.status(200).json("You made it");
});

/**
  Generic error handling for routes, would hide the stack on production.
**/
app.use(function (err, req, res) {
  res.status(err.status || 500).json({
    message: err.message,
    error: err,
    title: 'error'
  });
});

var server = http.createServer(app).listen(8000);
