"use strict";

var AWS = require( "aws-sdk" ),
    async = require('async');

var instance = null;

// SEND MESSAGE INTO SQS QUEUE.
var Broadcaster = function() {

  this.client = new AWS.SQS({
    region: "eu-west-1",
    params: {
      QueueUrl: "https://sqs.eu-west-1.amazonaws.com/456265475845/calculate-trending-development"
    }
  });
}

// GET THE BORADCASTER CLIENT IN A SINGLETON PATTERN.
var getBroadcasterClient = function(){
  if(!instance) instance = new Broadcaster();

  return instance.client;
}

module.exports = getBroadcasterClient();
