/*
YOU MUST SET THE ENV VARIABLE TO THE ENVIRONMENT YOUR CODE RUNS IN!  FAILURE TO DO SO WILL RESULT IN ALL YOUR KEYS FAILING.

Example output of not setting ENV: List of Invalid Keys: /env/undefined/dbpass,/env/undefined/dbuser

Usage example:

Pass a list to getSecrets() containing the keys you want to retrieve:

require('patientpop_nodejs_utils').getSecrets(['dbpass', 'dbuser'], (err, secrets, invalid_keys) => {
  if (err) {
    console.log('calling the util caused an error');
    return;
  }
  if (invalid_keys.length > 0) {
    console.log(`List of Invalid Keys: ${invalid_keys}`);
    return; 
  };

  console.log(`Database Password is: ${secrets['dbpass']}`);
});

Normal working output: Database Password is: tickertape

If you have invalid keys in your list, the program will tell you what they are and then exit:

Example output having invalid keys: List of Invalid Keys: /env/qa/BADKEY
*/

"use strict";
var AWS = require("aws-sdk");
var secrets = {};
var invalid_keys = [];
var env = process.env.ENV;
var fmtd_keys = [];
module.exports = {

    getSecrets: function (keys, callback) {
        keys.forEach(function (key) {
            fmtd_keys.push(`/env/${env}/${key}`);
        });

        var ssm = new AWS.SSM({region: "us-east-1"});
        var params = {
            Names: fmtd_keys,
            WithDecryption: true
        };

        ssm.getParameters(params, function (err, data) {
            if (err) {
                console.log(err, err.stack, data);
                callback(err);
                return;
            }

            data.Parameters.forEach(function (parameter) {
                var name = parameter.Name.split("/")[3];
                secrets[name] = parameter.Value;
            });

            data.InvalidParameters.forEach(function (parameter) {
                invalid_keys.push(parameter);
            });

            callback(null, secrets, invalid_keys);
        });
    }
};
