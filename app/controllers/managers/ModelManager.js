/**
 * Created by droidNinja on 04/07/16.
 */
var utils = require('../../utils/utils');
var _ = require('lodash');
var Constants = require('../../constants/Constants');
var db = require('../../../config/sequelize');

function ModelManager()
{
}

ModelManager.prototype.getUserModel  = function(dbObj)
{
    if(_.isUndefined(dbObj) ||_.isNull(dbObj))
        return null;

    var userObj = {};
    userObj.userId = dbObj.userId;
    userObj.displayName = _.trim(dbObj.firstName + " " + dbObj.lastName);
    userObj.email = dbObj.email;
    userObj.gender = dbObj.gender;
    userObj.nationality = dbObj.nationality;
    userObj.pictureUrl = dbObj.pictureUrl;
    userObj.coverUrl = dbObj.coverUrl;
    userObj.countryCode = dbObj.countryCode;

    return userObj;
};

ModelManager.prototype.getShortUserModel  = function(dbObj)
{
    if(_.isUndefined(dbObj) ||_.isNull(dbObj))
        return null;

    var userObj = {};
    userObj.userId = dbObj.userId;
    userObj.displayName = _.trim(dbObj.firstName + " " + dbObj.lastName);
    userObj.pictureUrl = dbObj.pictureUrl;
    userObj.coverUrl = dbObj.coverUrl;
    userObj.nationality = dbObj.nationality;
    userObj.countryCode = dbObj.countryCode;

    if(!_.isUndefined(dbObj.level))
    {
        userObj.level = _.isNull(dbObj.level)?1:dbObj.level;
    }

    return userObj;
};

ModelManager.prototype.getShortUserModelArray = function(userArray)
{
    if(_.isUndefined(userArray) ||_.isNull(userArray))
        return [];

    var arrayObj = [];
    for(var index=0;index<userArray.length;index++)
    {
        if(userArray[index]!=null && userArray[index].userId!=1)
            arrayObj.push(ModelManager.prototype.getShortUserModel(userArray[index]));
    }

    return arrayObj;
};

ModelManager.prototype.getMediaModel = function(mediaObj)
{
    if(_.isUndefined(mediaObj) ||_.isNull(mediaObj))
        return null;

    var mediaModel = {};

    mediaModel.mediaId = mediaObj.mediaId;
    mediaModel.url = mediaObj.url;
    mediaModel.type = mediaObj.type;

    return mediaModel;
};

ModelManager.prototype.getMediaArray = function(mediaArray)
{
    if(_.isNull(mediaArray) || _.isUndefined(mediaArray))
        return [];

    var locationArray = [];
    for(var index=0;index<mediaArray.length;index++)
    {
        locationArray.push(this.getMediaModel(mediaArray[index]));
    }
    return locationArray;
};

module.exports = ModelManager.prototype;