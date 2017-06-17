# Recurring Payments

## Overview
This is basically an impelementation of the blog post here:
[Dirt Cheap Recurring Payments with Stripe](http://normal-extensions.com/2017/05/05/simple-recurring/)

This is implemented with no real error checking on Lambda, as outlined
in the post. The major difference is this implementation is written in
Node.js as opposed to Python.

## Project Structure

* `/src` - Source code for the lambda functions
* `/static` - HTML to be hosted for the UI; I used an S3 bucket
* `serverless.yml` - Configuration file lambda invocation and configuration
