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
    userObj.displayName = dbObj.firstName + " " + dbObj.lastName;
    userObj.email = dbObj.primaryEmail;
    userObj.userType = dbObj.userType;
    userObj.gender = dbObj.gender;
    userObj.bio = dbObj.bio;
    userObj.birthDate = utils.getFormattedDateFromDBDate(dbObj.birthDate);
    userObj.phone = dbObj.phone;
    userObj.nationality = dbObj.nationality;
    userObj.pictureUrl = dbObj.pictureUrl;
    userObj.currentLocation = this.getLocationModel(dbObj.currentLoc);
    userObj.homeLocation = this.getLocationModel(dbObj.homeLoc);
    userObj.isTravelerTypeSet = dbObj.isTravelTypeSet;
    userObj.isInterestsSet = dbObj.isInterestsSet;
   var inviteCodeModel = this.getInviteModel(dbObj.inviteCode);
    if(!_.isNull(inviteCodeModel))
        userObj.inviteCode = inviteCodeModel.inviteCode;

    if(!_.isUndefined(dbObj.last_active))
        userObj.lastActive = utils.getTimestampFromDBDate(dbObj.last_active);

    return userObj;
};

ModelManager.prototype.getUserType = function(userObj)
{
    if(userObj.currentLocation.country!=userObj.userLocation.country || userObj.currentLocation.country!=userObj.nationality)
        return Constants.USER_TYPE.EXPAT;
    else if(userObj.currentLocation.city!=userObj.userLocation.city || userObj.currentLocation.state!=userObj.userLocation.state)
        return Constants.USER_TYPE.TRAVELER;
    else
        return Constants.USER_TYPE.LOCAL;
};


ModelManager.prototype.getShortUserModel  = function(dbObj)
{
    if(_.isUndefined(dbObj) ||_.isNull(dbObj))
        return null;

    var userObj = {};
    userObj.userId = dbObj.userId;
    userObj.displayName = dbObj.firstName + " " + dbObj.lastName;
    userObj.userType = dbObj.userType;
    userObj.pictureUrl = dbObj.pictureUrl;
    if(!_.isUndefined(dbObj.last_active))
        userObj.lastActive = utils.getTimestampFromDBDate(dbObj.last_active);

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
    mediaModel.meta = mediaObj.meta;

    if(!_.isUndefined(mediaObj.entityId))
        mediaModel.postId = mediaObj.entityId;

    if(!_.isUndefined(mediaObj.likesCount))
        mediaModel.likesCount = mediaObj.likesCount;

    if(!_.isUndefined(mediaObj.commentCount))
        mediaModel.commentCount = mediaObj.commentCount;

    if(!_.isUndefined(mediaObj.shareCount))
        mediaModel.shareCount = mediaObj.shareCount;

    if(!_.isUndefined(mediaObj.isLikedByMe))
        mediaModel.isLikedByMe = _.isNull(mediaObj.isLikedByMe)?false:(mediaObj.isLikedByMe==1);

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

ModelManager.prototype.getCategoryModel = function(categoryModelObj)
{
    if(_.isUndefined(categoryModelObj))
        return null;

    var categoryObj = {};

    categoryObj.categoryId = categoryModelObj.categoryId;
    categoryObj.type = categoryModelObj.type;
    categoryObj.subCategories = this.getCategoryArray(categoryModelObj.subcategories);

    return categoryObj;
};

ModelManager.prototype.getCategoryArray = function(arrayObj)
{
    if(_.isUndefined(arrayObj))
        return [];

    var categoryArray = [];
    for(var index=0;index<arrayObj.length;index++)
    {
        categoryArray.push(this.getCategoryModel(arrayObj[index]));
    }

    return categoryArray;
};

module.exports = ModelManager.prototype;