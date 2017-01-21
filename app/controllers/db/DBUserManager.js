'use strict';

/**
 * Module dependencies.
 */
var db = require('../../../config/sequelize');
var crypto = require('crypto');
var Constants = require('../../constants/Constants');
var utils = require('../../utils/utils');
var ModelManager = require('../managers/ModelManager');
var _ = require('lodash');
var async = require('async');


        exports.create = function(profile, done) {

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

