'use strict';

/**
 * Module dependencies.
 */
var db = require('../../../config/sequelize');
var utils = require('../../utils/utils');
var DBUserManager = require('./DBUserManager');
var async = require('async');
var Constants = require('../../constants/Constants');
var ModelManager = require('../managers/ModelManager');
var _ = require('lodash');


(function() {
    var DBEntityManager;

    DBEntityManager = (function() {
        function DBEntityManager() {}

        DBEntityManager.prototype.create = function(queryObj, done)
        {
            db.Entity.create(queryObj).then(function (entity) {
                done(null, entity);
            }).catch(function(err){
                done(err,null);
            });
        };

        return DBEntityManager;

    })();

    module.exports = DBEntityManager.prototype;

}).call(this);