/**
 * Created by droidNinja on 16/02/17.
 */

const _ = require("lodash");
const axios = require("axios");
const utils = require("../../utils/utils");
const ZomatoScraper = require("./ZomatoScraper");
const Constants = require("../../constants/Constants");
const async = require("async");
const GooglePlaces = require('node-googleplaces');
const API_KEY = "AIzaSyCRhkRXK185F3483q41KeQfozIaPAkp0yw";
//const API_KEY = "AIzaSyAdcrVYEwYACtfjGMlqu2NFaVI5WFgl-j8";
const places = new GooglePlaces(API_KEY);

const TYPE_RESTAURANT = "restaurant|food|cafe|bar";
const RESTAURANT = ['restaurant','food','cafe','bar'];
const PLACE = ['locality','political'];
const ATTRACTION = ['point_of_interest','establishment'];

module.exports = {

    validateRequest: function (req, res, next) {
        var queryObj = {};

        if(!_.isUndefined(req.query.radius))
            queryObj.radius = req.query.radius;
        else
            queryObj.radius = 20;


        if(_.isUndefined(req.query.lat) && _.isUndefined(req.query.lon))
            return utils.printError(res, Constants.ERROR_TYPE.INVALID_PARAMETERS);
        else {
            queryObj.location = req.query.lat+","+req.query.lon;
        }

        if(_.isUndefined(req.query.isOpen))
            queryObj.isOpen = false;
        else {
            queryObj.isOpen = req.query.isOpen;
        }

        req.queryObj = queryObj;
        next();
    },
    getPlaceInfoByPlaceId: function (req, res) {
        if(_.isUndefined(req.query.placeId))
            return utils.printError(res, Constants.ERROR_TYPE.INVALID_PARAMETERS);

        getPlaceDetails(req.query.placeId, function (err, results) {
            if(!err)
            {
                ZomatoScraper.getRestaurantInfo(results.name,results.city, function (err, data) {
                    if(!err)
                    {
                        var response = {
                            google: results,
                            zomato: data
                        };
                        return utils.printResponse(res, response,"");
                    }
                    else
                        return utils.printError(res, err);
                });
                //return utils.printResponse(res, results,"");
            }
            else
                return utils.printError(res, err);
        });
    },
    getPlaceDetails: function (placeId, done) {
        getPlaceDetails(placeId, function (err, results) {
            if(!err)
            {
                if(results.placeType==Constants.PLACE_TYPE.RESTAURANT) {
                    ZomatoScraper.getRestaurantInfo(results.name, results.city, function (err, data) {
                        if (!err) {
                            var response = {
                                google: results,
                                zomato: data
                            };
                            done(null, response);
                        }
                        else
                            done(err, null);
                    });
                }
                else
                {
                    var response = {
                        google: results
                    };
                    done(null, response);
                }
                //return utils.printResponse(res, results,"");
            }
            else
                done(err, null);
        });
    },

    getRestaurants: function (req, res) {
        req.queryObj.type = TYPE_RESTAURANT;
       getPlaces(req.queryObj, function (err, results) {
           if(!err)
           {
               return utils.printResponse(res, results,"");
           }
           else
               return utils.printError(res, err);
       });
    },

    getTopRestaurants: function (req, res) {
        var queryObj = {};

        if(!_.isUndefined(req.query.city) && !_.isUndefined(req.query.country))
        {
            queryObj.city = req.query.city;
            queryObj.country = req.query.country;
        }
        else
            return utils.printError(res, Constants.ERROR_TYPE.INVALID_PARAMETERS);


        queryObj.type = TYPE_RESTAURANT;
        queryObj.query = "Best restaurants in "+queryObj.city+", "+queryObj.country;

        getPlacesByQuery(queryObj, function (err, results) {
            if(!err)
            {
                return utils.printResponse(res, results,"");
            }
            else
                return utils.printError(res, err);
        });
    },

    getTopAttractions: function (city, country, done) {
        var queryObj = {};

        if(!_.isUndefined(city) && !_.isUndefined(country))
        {
            queryObj.city = req.query.city;
            queryObj.country = req.query.country;
        }
        else
            return utils.printError(res, Constants.ERROR_TYPE.INVALID_PARAMETERS);


        queryObj.query = "Top Attractions in "+queryObj.city+", "+queryObj.country;

        getPlacesByQuery(queryObj,done);
    }
};

var getPlacesByQuery = function (queryObj, done) {
    places.textSearch({
        query: queryObj.query,
        type: queryObj.type
    }, function(err, results)
    {
        parsePlaces(results, done);
    });
};

var getPlaces = function (queryObj, done) {
    places.textSearch({
        location: queryObj.location,
        radius: queryObj.radius,
        opennow: queryObj.isOpen,
        type: queryObj.type
    }, function(err, results)
    {
        parsePlaces(results, done);
    });
};

var parsePlaces = function (results, done) {
    console.log("**** GOT places results ***");
    var data = JSON.parse(results.text).results;
    console.log(data);
    var placesArray = [];
    async.each(data,

        function(placeData, callback){
            console.log("getPlaceDetails"+placeData.place_id);
            getPlaceDetails(placeData.place_id, function(err, place){
                if(!err)
                {
                    console.log("Got PlaceDetails"+place);

                    if(place!=null)
                    {
                        place.image = getPhotoURL(placeData.photos[0].photo_reference);
                        placesArray.push(place);
                    }

                    callback();
                }
            });
        },

        function(err){
            done(null, placesArray);
        }
    );
};

var getPlaceDetails = function (placeId, done) {
    places.details({
        placeid: placeId
    }, function(err, results)
    {
        parsePlaceDetails(JSON.parse(results.text), done)
    })
};

var parsePlaceDetails = function (result, done) {
    if(_.isUndefined(result))
        done("IS NULL", null);

    var place = {};
    var data = result.result;

        console.log("*** Parsing restaurant ***");
        place.address = data.formatted_address;
        place.phoneNum = _.isUndefined(data.international_phone_number)?"":data.international_phone_number;
        place.latitude = data.geometry.location.lat;
        place.longitude = data.geometry.location.lng;
        place.name = data.name;

        if(!_.isUndefined(data.opening_hours)) {
            place.openingHoursMeta = {
                data: data.opening_hours.periods,
                text: data.opening_hours.weekday_text
            };
        }
        else
            place.openingHoursMeta = null;
        place.rating = _.isUndefined(data.rating)?null:data.rating;
        place.placeId = data.place_id;
        place.types = data.types;
        place.placeType = getPlaceType(data.types);
        place.url = data.url;
        place.website = _.isUndefined(data.website)?"":data.website;

        var vicinity = data.vicinity.split(",");
        place.city = vicinity[vicinity.length-1].trim();
        place.country = getCountry(data.address_components);
        var maxPhoto = 0;
        place.photos = [];


        if(!_.isUndefined(data.photos) && data.photos.length>0) {
            async.each(data.photos,

                function (photo, callback) {
                    if (maxPhoto < 5) {

                        place.photos.push(getPhotoURL(photo.photo_reference));
                        callback();
                    }
                    else
                        callback();

                    maxPhoto++;
                },

                function (err) {
                    done(null, place);
                }
            );
        }
        else
            done(null, place);
};

var getPhotoURL = function (code) {
    return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference="+code+"&key="+API_KEY;
};

var getPlaceType = function (types) {
    if(utils.contains(types, RESTAURANT)) {
        return Constants.PLACE_TYPE.RESTAURANT
    }
    else if(utils.contains(types, ATTRACTION)) {
        return Constants.PLACE_TYPE.ATTRACTION
    }
    else
        return Constants.PLACE_TYPE.LOCATION;
};

var getCountry = function (locArray) {
  for(var index=0;index<locArray.length;index++)
  {
      if(_.includes(locArray[index].types, "country"))
      {
          return locArray[index].long_name;
      }
  }
    return "";
};
