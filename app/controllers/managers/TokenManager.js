'use strict';

/**
 * Module dependencies.
 */
var accessTokenDBManager = require('../db/DBAccessTokenManager');
var winston = require('../../../config/winston');
var config = require('../../../config/config');
var jwt = require('../../utils/jwtauth');
var Constants = require('../../constants/Constants');

(function() {
    var TokenManager;

    TokenManager = (function() {
        function TokenManager() {}

        TokenManager.prototype.generateTokenForUser = function(user, done) {
        // If authentication is success, we will generate a token
        // and dispatch it to the client
        jwt.genToken({
            userId: user.userId,
            userType: user.userType
        }, 999999, function (token) {

            accessTokenDBManager.create({
                token: token,
                userId: user.userId
            }, function (err, obj) {
                if (!err) {
                    done(null, obj.token);
                }
                else {
                    done(err, null);
                }

            });
        }, function (err) {
            done(err, err);
        });
    };

        TokenManager.prototype.validateToken = function(accessToken, done) {

            jwt.processToken(accessToken, function (data) {
                //if token is valid and not expired through jwt
                console.log(data.sub.userId);

                //check if its not invalidated by user
                accessTokenDBManager.get({
                    token: accessToken
                }, function (err, accessTokenObj) {
                    if (!err) {
                        //check if token is expired or not
                        if (!accessTokenObj.isExpired) {
                            done(null, data);
                        }
                        else {
                            done(Constants.ERROR_TYPE.EXPIRED_TOKEN, null);
                        }
                    }
                    else {
                        done(Constants.ERROR_TYPE.INVALID_TOKEN, null);
                    }
                });

            }, function (err) {
                //if its expired or invalid, update
                done(Constants.ERROR_TYPE.INVALID_TOKEN, null);
                accessTokenDBManager.update({
                    token: accessToken,
                    isExpired: 1
                }, function (err, obj) {

                });
            });

        };

        TokenManager.prototype.invalidateToken = function(accessToken, done) {

            accessTokenDBManager.update({
                token: accessToken,
                isExpired: 1
            }, function (err, obj) {
                if (err) {
                    done(Constants.ERROR_TYPE.INVALID_TOKEN, obj)
                }
                else {
                    done(null, obj);
                }
            });
        };

        TokenManager.prototype.checkForValidTokenType = function(routeName, tokenType, done)
            {
                if(routeName === Constants.API.SET_USER_TYPE || routeName === Constants.API.SEND_OTP ||
                    routeName === Constants.API.VERIFY_OTP|| routeName === Constants.API.CREATE_PROFILE){

                    //if api is set user type, then check if it has auth token, else invalid token

                    if(!isAuthToken(tokenType))
                        done(Constants.ERROR_TYPE.INVALID_TOKEN);
                    else
                        done(null);
                }
                else
                {
                    //for all other api, it requires a user token, if not, invalid token

                    if(isUserToken(tokenType))
                        done(null);
                    else
                        done(Constants.ERROR_TYPE.INVALID_TOKEN);
                }
            };

        function isAuthToken(tokenType)
        {
            return (tokenType === Constants.TOKEN_TYPE.AUTH_TOKEN);
        }

        function isUserToken(tokenType)
        {
            return (tokenType === Constants.TOKEN_TYPE.USER_TOKEN);
        }

    return TokenManager;

})();

module.exports = TokenManager.prototype;

}).call(this);