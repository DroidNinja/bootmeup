/**
 * Created by droidNinja on 14/02/17.
 */

const _ = require("lodash");
const axios = require("axios");
const utils = require("../../utils/utils");
const Constants = require("../../constants/Constants");
const async = require("async");
const XRAY = require("x-ray");
var versionNum = "201702132317";
const VERSION_URL = "https://www.rome2rio.com/s/Melbourne/New-Delhi";
const options = {
    method: "GET",                      //Set HTTP method
    jar: true,                          //Enable cookies
    headers: {                          //Set headers
        'Host': 'www.rome2rio.com',
        'User-Agent': 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    }
};
var scraper = XRAY({
    filters: {
        trim: function (value) {
            return typeof value === 'string' ? value.trim() : value
        },
        reverse: function (value) {
            return typeof value === 'string' ? value.split('').reverse().join('') : value
        },
        slice: function (value, start , end) {
            return typeof value === 'string' ? value.slice(start, end) : value
        }
    }
});
const makeDriver = require('request-x-ray');
const driver = makeDriver(options)  ;    //Create driver

module.exports = {

    validateRequest: function (req, res, next) {
        scraper.driver(driver);

        var queryObj = {};
        if(!_.isUndefined(req.query.currency))
            queryObj.currency = req.query.currency;

        if(!_.isUndefined(req.query.radius))
            queryObj.radius = req.query.radius;
        else
            queryObj.radius = -1;


        if(_.isUndefined(req.query.lat) && _.isUndefined(req.query.lon))
            return utils.printError(res, Constants.ERROR_TYPE.INVALID_PARAMETERS);
        else {
            queryObj.s0 = req.query.lat+","+req.query.lon;
        }

        scraper(VERSION_URL, {
            info: ["link@href"]
        })(function(err, data) {
            if(!err) {

                if(data.info.length >0)
                {
                    var text = data.info[1].split(".");
                    if(text.length > 0)
                    {
                        versionNum = text[text.length-2];
                        console.log("versionNum:"+versionNum);
                        req.queryObj = queryObj;
                        next();
                    }
                }
            }
            else
                return utils.printError(res, err);
        });

    },
    getNearbyAttractions: function (req, res) {
        getAttractions(req.queryObj, function (err, response) {
            if(!err)
            {

                return utils.printResponse(res, response,"");
            }
            else
                return utils.printError(res, err);
        });
    },

    getThingsToDo : function (query, done) {
        scraper.driver(driver);

        var queryObj = {};
        if(!_.isUndefined(query.currency))
            queryObj.currency = query.currency;

        if(!_.isUndefined(query.radius))
            queryObj.radius = query.radius;
        else
            queryObj.radius = -1;


        if(_.isUndefined(query.lat) && _.isUndefined(query.lon))
            done(Constants.ERROR_TYPE.INVALID_PARAMETERS, null);
        else {
            queryObj.s0 = query.lat+","+query.lon;
        }

        scraper(VERSION_URL, {
            info: ["link@href"]
        })(function(err, data) {
            if(!err) {

                if(data.info.length >0)
                {
                    var text = data.info[1].split(".");
                    if(text.length > 0)
                    {
                        versionNum = text[text.length-2];
                        console.log("versionNum:"+versionNum);

                        getAttractions(queryObj, done);

                    }
                }
            }
            else
                done(err, null);
        });
    }

};

var getAttractions =  function (queryObj, done) {
    const BASEURL = "https://www.rome2rio.com/api/json/GetAttractionsNear?version="+versionNum;
    axios.get(BASEURL,{
            params: queryObj
        })
        .then(function (response) {
            console.log(response.data);
            parseResponse(response.data, done);
        })
        .catch(function (error) {
            done(err,null);
        });
};

var getAttractionInfo = function (placeId, done) {
    const URL = "https://www.rome2rio.com/api/json/AttractionInfo?attractionId="+placeId+"&version="+versionNum;
    console.log(" getAttractionInfo URL:"+URL);
    axios.get(URL)
        .then(function (response) {
            console.log(response);
            done(null, parseAttractionInfo(response.data));
        })
        .catch(function (error) {
            done(err,null);
        });
};

var parseAttractionInfo = function (data) {
    if(!_.isUndefined(data) && !_.isEmpty(data))
    {
        var location = {};
        location.name = data[0];

        if(data.length>1)
        location.image = data[1];

        if(data.length>2)
        location.wikiURL = data[2];

        if(data.length>3)
            location.description = data[3];

        return location;
    }

    return null;
};

var parseResponse = function (response, done) {
    if(_.isEmpty(response))
        return null;

    var data = response[0];
    var places = data[3];
    var placeTypes = data[4];

    var locationArray = [];
    var count=0;
    async.each(places,

        function(placeId, callback){
            getAttractionInfo(placeId, function(err, location){
               if(!err)
               {
                   if(location!=null)
                   {
                       location.type = placeTypes[count];
                       locationArray.push(location);
                   }

                   callback();
                   count++;
               }
            });
        },

        function(err){
            done(null, locationArray);
        }
    );
};