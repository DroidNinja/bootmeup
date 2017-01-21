'use strict';

var uuid = require('node-uuid');
var config = require('../../config/config');
var jsonwebtoken = require ('jsonwebtoken');

exports.processToken = function(token, success, fail) {
      jsonwebtoken.verify(token, config.expressSessionSecret, {}, function(err, data) {
        if(err) {
          fail(err);
        } else {
          success(data);
        }
      });
    };

exports.genToken = function(data, numDays, success, fail) {
      try {
          var claims = {
              sub: data
          };
        var token = jsonwebtoken.sign(claims, config.expressSessionSecret, {
            expiresIn: numDays * 60 * 60
        });
        success(token);
      } catch(err) {
        fail(err);
      }
    };