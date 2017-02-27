'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config');
var Hashids = require("hashids");
var _ = require('lodash');
var moment = require('moment');
var crypto = require("crypto");
var mime = require('mime');
var Constants = require('../constants/Constants');
var winston = require('../../config/winston');
var metafetch = require('../modules/metafetch/index')

exports.printResponse = function ( res, responseObj, message)
{
    var dataObj = {};
    dataObj.data = responseObj;
    dataObj.message = message;

    winston.info('******RESPONSE START*****');
    winston.info(dataObj);
    winston.info('******RESPONSE END*****');
    return res.jsonp(dataObj);
};

exports.printError = function(res, errorObj)
{
    res.status(400);

    if(! _.isNull(errorObj)) {
        var response= {};
        response.code = errorObj.code;
        response.errorMessage = errorObj.message;
    }

    winston.info('******RESPONSE START*****');
    winston.info(response);
    winston.info('******RESPONSE END*****');

    return res.jsonp(response);
};

exports.getInviteCode = function(uniqueIndex)
{
    var hashIds = new Hashids(config.inviteCodeSalt, 5);
    var code = hashIds.encode(uniqueIndex);

    return _.toUpper(code);
};

exports.getProfileModel =  function (firstName, lastName, email, password, profileId, gender, profileImageUrl,provider, accessToken)
{
    return {
        firstName : firstName,
        lastName: lastName ? lastName:'',
        email : email,
        profileId : profileId,
        gender: gender ? gender : 'Others',
        profileImageUrl: profileImageUrl,
        provider: provider,
        accessToken: accessToken,
        password: password
    };
};

exports.inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

exports.getTimestampFromDBDate = function(dbDate)
{
    return moment(dbDate).unix();
};

exports.getFormattedDateFromDBDate = function(dbDate)
{
    return moment(dbDate).utc().format('YYYY-MM-DD');
};

exports.getFormattedDateFromTimeStamp = function(timeStamp)
{
    return moment.utc(timeStamp, 'X');
};

exports.getDateFromTimeStamp = function(timeStamp, format)
{
    return moment.utc(timeStamp, 'X').format(format);
};

exports.getMD5FromString = function(text)
{
    return crypto.createHash('md5').update(text).digest("hex");
};

exports.checkForSupportedFileTypes = function(fileObj)
{
    if(_.includes(Constants.FILE_TYPES.IMAGE_TYPES, mime.lookup(fileObj.path)))
        return true;

    return false;
};

exports.checkForSupportedImageTypes = function(fileObj)
{
    if(_.includes(Constants.FILE_TYPES.IMAGE_TYPES, mime.lookup(fileObj.path)))
        return true;

    return false;
};

exports.getFirstLink = function(text)
{
    var url = new RegExp(
        "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
        ,"g"
    );

    var link = text.match(url);

    if(link!=null && link.length>0)
        return link[0];

    return null;
};

exports.updateOrCreate = function (model, where, newItem, onCreate, onUpdate, onError) {
    // First try to find the record
    model.findOne({where: where}).then(function (foundItem) {
        if (!foundItem) {
            // Item not found, create a new one
            model.create(newItem)
                .then(function (updatedObj) {
                    onCreate(updatedObj);
                })
                .error(function (err) {
                    onError(err);
                });
        } else {
            // Found an item, update it
            model.update(newItem, {where: where})
                .then(function (updatedObj) {
                    onUpdate(updatedObj);
                })
                .catch(function (err) {
                    onError(err);
                });
        }
    }).catch(function (err) {
        onError(err);
    });
};

exports.getEntityId = function(parentId, childId)
{
    return parentId+'_'+childId;
};

exports.getMetaInfo = function(link,done)
{
    metafetch.fetch(link, {
        flags: {
            images: false,
            links: false
        },
        http: {
            timeout: 30000
        }
    }, done);
};

exports.getCurrentTimestamp = function () {
    return moment().unix();
};

exports.equals = function (text1, text2) {
    return _.isEqual(_.toLower(text1), _.toLower(text2));
};

exports.merge = function (arr1, arr2, key) {
    return _.chain(arr1) // start sequence
        .keyBy(key) // create a dictionary of the 1st array
        .merge(_.keyBy(arr2, key)) // create a dictionary of the 2nd array, and merge it to the 1st
        .values() // turn the combined dictionary to array
        .value(); // get the value (array) out of the sequence
};

exports.contains = function (source, checkArray) {
  for(var index=0;index<checkArray.length; index++)
  {
      if(_.includes(source, checkArray[index]))
        return true;
  }
    return false;
};

exports.arrayContainsAnotherArray = function(needle, haystack){
    for(var i = 0; i < needle.length; i++){
        if(haystack.indexOf(needle[i]) === -1)
            return false;
    }
    return true;
};

