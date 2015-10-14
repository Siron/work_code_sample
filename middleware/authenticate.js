"use strict";

var _ = require('underscore'),
    express = require('express'),
    router = express.Router(),
    async = require('async'),
    parser = require('body-parser');

module.exports = function(settings) {
  /**
    We may want to load the user into the request but we don't always want to
      block on every route if we don't have a token.
  **/
  settings = _.defaults(settings, {
    restrict: true
  });

  return function(req, res, next) {
    var authToken = req.headers.authorization;

    /**
      In reality this could a JWT token combination of device, userid, network
        and other variables used to identify a user. The process would be as follows:
          1. Grab token and decode.
          2. Check if the token exists in the DB (redis or mongodb using TTL would be perfect)
            2.1 If we have the token - check that the decoded elements - user ID, device etc match what we have in the DB
              2.1.1 Either approve or reject based on that matching
            2.2 Reject request
        For this example we are simply checking for a string based token then checking
          the if we need a token for the request or not and then moving on.
    **/
    if (authToken && authToken == "Bearer hiddentoken") {
      return next ();
    } else if (settings.restrict) {
        res.status(401).json({ message: "You are not authorised." });
    } else {
      next();
    }

  }
};
