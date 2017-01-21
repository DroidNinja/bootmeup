'use strict';

/**
 * Module dependencies.
 */
var config = require('../../../config/config');
var validate = require('validate.js');
var Constants = require('../../constants/Constants');
var utils = require('../../utils/utils');
var moment = require('moment');
var _ = require('lodash');

validate.extend(validate.validators.datetime, {
    // The value is guaranteed not to be null or undefined but otherwise it
    // could be anything.
    parse: function(value, options) {
        return +moment.utc(value);
    },
    // Input is a unix timestamp
    format: function(value, options) {
        var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
        return moment.utc(value).format(format);
    }
});

var constraints = {
    firstName: {
        presence: true,
        length: {
            minimum: 1,
            message: "must be at least 1 characters"
        }
    },
    password: {
        presence: true,
        length: {
            minimum: 8,
            message: "must be at least 6 characters"
        }
    },

};

var constraintObjs =
{
      checkPresence: {
          presence: true
      },
    providerType:
    {
        presence: true,
        inclusion: ['EMAIL', 'GOOGLE', 'FACEBOOK']
    },
    privacyType:
    {
        presence: true,
        inclusion: [0,1,2,3,4]
    },
    dateType:{
        datetime: {
            dateOnly: true,
            message: "Invalid date"
        }
    },
    email:{
        presence: true,
        email: true
    },
    password: {
        presence: true,
        length: {
            minimum: 6,
            message: "must be at least 6 characters"
        }
    },
    phone: {
        presence: true,
        length: {
            is: 10,
            message: "must be 10 number"
        }
    }
};

exports.validateRegistrationData = function (req, res, next)
{
    var userObj = {};
    userObj.firstName = req.body.firstName;
    userObj.lastName = req.body.lastName;
    userObj.email = req.body.email;
    userObj.gender = req.body.gender;
    userObj.profileId = req.body.profileId;
    userObj.accessToken = req.body.accessToken;
    userObj.pictureUrl = req.body.pictureUrl;

    var attributes = {
        firstName: userObj.firstName,
        email: userObj.email,
        gender: userObj.gender,
        profileId: userObj.profileId,
        accessToken: userObj.accessToken,
    };

    var constraints = {
        email: constraintObjs.email,
        firstName: constraintObjs.checkPresence,
        gender: constraintObjs.checkPresence,
        profileId: constraintObjs.checkPresence,
        accessToken: constraintObjs.checkPresence
    };

    validate.async(attributes, constraints).then(function()
    {
        req.userObj = userObj;
        next();
    }, function(err)
    {
        console.log(err);
        return utils.printError(res,Constants.ERROR_TYPE.INVALID_PARAMETERS);
    });
};

