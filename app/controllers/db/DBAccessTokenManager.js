'use strict';

/**
 * Module dependencies.
 */
var db = require('../../../config/sequelize');

exports.create = function(tokenObj, done)
{
    db.accessToken.build({
        token: tokenObj.token,
        userId: tokenObj.userId,
        isExpired: 0
    }).save().then(function(accessTokenObj){
        done(null, accessTokenObj);
    }).catch(function(err){
        done(err, null);
    });
};

exports.update = function(accessTokenObj, done)
{
    db.accessToken.find({where:{token: accessTokenObj.token}}).then(function (data) {
        if (!data) {
            console.log("Couldn't find access token");
            done("Couldn't find access token", null);
        }
        else{
            data.updateAttributes({
                isExpired: accessTokenObj.isExpired
            }).then(function (updatedAccessTokenObj) {
                done(null, updatedAccessTokenObj);
            })
        }
    }).catch(function(err){
        done(err);
    });
};

exports.get = function (accessTokenObj, done)
{
    db.accessToken.find({where:{token: accessTokenObj.token}}).then(function (data) {
        if (!data) {
            console.log("Couldn't find access token");
            done("Couldn't find access token", null);
        }
        else{
            done(null, data);
        }
    }).catch(function(err){
        done(err);
    });
};