'use strict';

var stripe;

var AWS = require("aws-sdk");
var kms = new AWS.KMS();
var qs = require('querystring');
var environmentVariable = process.env.variable1;
var cipherBuffer = Buffer.from(environmentVariable, 'base64');
var decryptionPromise = kms.decrypt({ CiphertextBlob: cipherBuffer })
    .promise().then((decrypted) => {
      var stripeKey = decrypted.Plaintext.toString('ascii');
      console.log("Decrypted key", stripeKey);
      stripe = require('stripe')(decrypted.Plaintext.toString('ascii'));
      return;
    });

function hello(event, context, callback) {
  var parsedBody = qs.parse(event.body);
  decryptionPromise.then(() => {
    return createCustomer(parsedBody.stripeEmail, parsedBody.stripeToken);
  }).then((customer) => {
    return createSubscription(customer.id);
  }).then(() => {
    callback(null, {
      statusCode: 200,
      body: "Success!"
    });
  }).catch((err) => {
    console.log(err);
    callback(err);
  });
}

exports.hello = hello;

function createCustomer(email, token) {
  return new Promise((resolve, reject) => {
    stripe.customers.create({
      email: email,
      source: token
    }, (err, customer) => {
      (err) ? reject(err) : resolve(customer);
    });
  });
}

function createSubscription(customerId) {
  return new Promise((resolve, reject) => {
    stripe.subscriptions.create({
      customer: customerId,
      plan: 'base-plan',
    }, (err, subscription) => {
      (err) ? reject(err) : resolve(subscription);
    });
  });
}
