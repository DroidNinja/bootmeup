'use strict';

/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');
var winston = require('../../config/winston');
var config = require('../../config/config');
var jwt = require('../utils/jwtauth');
var utils = require('../utils/utils');
var tokenManager = require('./managers/TokenManager');
var request = require('request');
var _ = require('lodash');
var DBUserManager = require('./db/DBUserManager');
var Constants = require('../constants/Constants');
const ModelManager = require('./managers/ModelManager');



(function() {
    var AuthController;

    AuthController = (function() {
        function AuthController() {}

    AuthController.prototype.signUp = function(req, res) {
        var userObj = req.userObj;

        verifyFacebookUserAccessToken(userObj.fb.profileId, userObj.fb.accessToken, function(err)
        {
            if(err)
                return utils.printError(res, Constants.ERROR_TYPE.INVALID_TOKEN);


        });
    };


    AuthController.prototype.verify = function(req, res) {
        var userId = req.body.userId,
            accessToken = req.body.accessToken;

        if (userId || accessToken) {
            //validates user

            jwt.processToken(accessToken, function (data) {
                console.log(data.sub.userId);
                if (data.sub.userId === userId) {
                    return utils.printResponse(res, null, Constants.MESSAGES.VALID_TOKEN);
                }

            }, function (err) {
                return utils.printError(res, Constants.ERROR_TYPE.INVALID_TOKEN);
            });
        }
        else {
            return utils.printError(res, Constants.ERROR_TYPE.INVALID_PARAMETERS);
        }
    };

    AuthController.prototype.logout = function(req, res) {
        var accessToken = req.headers[Constants.ACCESS_TOKEN_HEADER];
        if (accessToken) {
            tokenManager.invalidateToken(accessToken, function (err, data) {
                if (!err) {
                    return utils.printResponse(res, true, Constants.MESSAGES.SUCCESS_MESSAGE);
                }
                else {
                    return utils.printError(res, err);
                }
            });
        }
        else {
            return utils.printError(res, Constants.ERROR_TYPE.INVALID_REQUEST);
        }
    };


    AuthController.prototype.validateRequest = function(req, res, next) {

        var accessToken = req.headers[Constants.ACCESS_TOKEN_HEADER];
        console.log('******ACCESSTOKEN ' + accessToken);

        if (accessToken) {

            //this is for development start
            var userId = req.headers.userid;
            if(userId)
            {
                req.userId = parseInt(userId);
                req.userType = Constants.USER_ROLE.ADMIN;
                next();
                return;
            }
            //this is for development end

            tokenManager.validateToken(accessToken, function (err, data) {
                if (!err) {
                    req.userId = data.sub.userId;
                    req.userType = data.sub.userType;

                    next();
                }
                else {
                    return utils.printError(res, err);
                }
            });
        }
        else {
            return utils.printError(res, Constants.ERROR_TYPE.INVALID_REQUEST);
        }
    };

        AuthController.prototype.tokenInfo = function(req, res)
        {
            var accessToken = req.headers[Constants.ACCESS_TOKEN_HEADER];
            console.log('******ACCESSTOKEN ' + accessToken);

            if (accessToken) {
                tokenManager.validateToken(accessToken, function (err, data) {
                    if (!err) {
                        utils.printResponse(res,data,"benchodaaa! lae li token di info, naah fad le tatte!");
                    }
                    else {
                        return utils.printError(res, err);
                    }
                });
            }
            else {
                return utils.printError(res, Constants.ERROR_TYPE.INVALID_REQUEST);
            }
        };

        AuthController.prototype.login = function(req, res)
        {

        };

return AuthController;

})();


module.exports = AuthController.prototype;
}).call(this);
/**
 * ********** PRIVATE METHODS ******************
 */

// Call facebook API to verify the token is valid
// https://graph.facebook.com/me?access_token=$token
    function verifyFacebookUserAccessToken(userId, token, done) {
        console.log(token);

        if(_.isEqual(token, "accessToken"))
        {
            done(null);
            return;
        }

        var path = Constants.FACEBOOK_ACCESS_TOKEN_URL + token;
        request(path, function (error, response, body) {

            var data = JSON.parse(body);
            console.log(body);
            console.log(error);
            if (!error && response && response.statusCode && response.statusCode === 200) {
                if (data.id === userId) {
                    console.log(true);
                    done(null);
                }
                else {
                    done(Constants.ERROR_TYPE.INVALID_USER);
                }
            }
            else {
                console.log(data.error);
                 done(data.error);
            }
        });
    }

    function verifyGoogleAccessToken(userId, token, done) {
        console.log(token);
        var path = Constants.GOOGLE_ACCESS_TOKEN_URL + token;
        request(path, function (error, response, body) {
            var data = JSON.parse(body);
            console.log(body);

            if (!error && response && response.statusCode && response.statusCode === 200) {
                console.log((data.user_id + " " + userId));
                if (data.user_id === userId) {
                    console.log(true);
                    done(null);
                }
                else {
                    done(Constants.ERROR_TYPE.INVALID_USER);
                }
            }
            else {
                console.log(data.error);
               done(data.error);
            }

        });
    }

    function generateToken(res, user)
    {
        tokenManager.generateTokenForUser(user, function (err, token) {
            if(!err) {
                var response = {
                    userDetails: ModelManager.getUserModel(user),
                    token: token
                };

                return utils.printResponse(res, response, Constants.MESSAGES.SUCCESS_MESSAGE);
            }
        });
    }

