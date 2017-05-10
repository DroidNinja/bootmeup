'use strict';

/**
 * Module dependencies.
 */
var db = require('../../../config/sequelize');
var crypto = require('crypto');
var Constants = require('../../constants/Constants');
var DBEntityManager = require('../db/DBEntityManager');
var utils = require('../../utils/utils');
var ModelManager = require('../managers/ModelManager');
var _ = require('lodash');
var async = require('async');


exports.create = function(profile, done) {
    DBEntityManager.create({
        entityType: Constants.ENTITY_TYPE.USER
    }, function (err, entity) {
        if(!err) {
            if (profile.provider == Constants.PROVIDER.GOOGLE) {
                profile.googleId = profile.profileId;
                profile.googleToken = profile.accessToken;
            }
            else if (profile.provider == Constants.PROVIDER.FACEBOOK) {
                profile.fbId = profile.profileId;
                profile.fbToken = profile.accessToken;
            }

            db.User.create({
                userId: entity.entityId,
                firstName: _.startCase(_.toLower(profile.firstName)),
                lastName: _.startCase(_.toLower(profile.lastName)),
                userType: profile.userType,
                email: profile.email,
                gender: (profile.gender === "") ? 'OTHERS' : profile.gender,
                pictureUrl: profile.pictureUrl,
                coverUrl: profile.coverUrl,
                countryCode: profile.countryCode,
                fbId: profile.fbId,
                fbToken: profile.fbToken,
                googleId: profile.googleId,
                googleToken: profile.googleToken,
                nationality: profile.nationality,
                isVerified: true
            }).then(function (user) {
                done(null, user);
            }).catch(function (err) {
                done(err, null);
            });
        }
        else
            done(err, null);
    });
};


exports.getUserById = function(userId, done) {
    db.User.find({
        where : { userId: userId }
    }).then(function(user){
        done(null, user);
    }).catch(function(err){
        done(err,null);
    });
};

exports.getUser = function(whereObj, done) {
    db.User.find({
        where : whereObj
    }).then(function(user){
        done(null, user);
    }).catch(function(err){
        done(err,null);
    });
};

exports.update = function(userObj, userId, done) {
    db.User.update(userObj,{
        where:{
            userId: userId
        }
    }).then(function(dbObj){
        done(null, dbObj);
    }).catch(function(err){
        done(err, null);
    });
};

exports.checkIfUserExists = function(email, done) {
    db.User.find({
        where : { email: email }
    }).then(function(user){
        if(user!=null) {
            done(null, user);
        }
        else
            done(null,null);
    }).catch(function(err){
        done(err,null);
    });
};