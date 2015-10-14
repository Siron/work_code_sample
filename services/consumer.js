"use strict";

var async = require('async'),
    AWS = require("aws-sdk"),
    Consumer = require('sqs-consumer');

// Grab the message and process it however we need to.
var app = Consumer.create({
  queueUrl: "url",
  region: "eu-west-1",
  batchSize: 1,
  handleMessage: function (message, done) {
    console.log("IN HERE");

    var id = message.Body;

    console.log("SQS message has been consumed, body id: ", id);

    // remove the message, we are done
    done();
  }
});

app.on('error', function (err) {
  console.log(err);
}).on('message_received', function(message){
  console.log(message);
});

app.start();
