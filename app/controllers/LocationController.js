/**
 * Created by droidNinja on 20/01/17.
 */
const _ = require("lodash");
const axios = require("axios");
const utils = require("../utils/utils");
const Constants = require("../constants/Constants");
const async = require("async");
const GooglePlacesManager = require("./location/GooglePlacesManager");
const Rome2RioManager = require("./location/Rome2RioManager");
const WeatherManager = require("./managers/WeatherManager");
const WikiManager = require("./managers/WikiManager");

module.exports = {
    getLocationInfo: function (req, res) {

        if(_.isUndefined(req.query.placeId))
            return utils.printError(res, Constants.ERROR_TYPE.INVALID_PARAMETERS);

        GooglePlacesManager.getPlaceDetails(req.query.placeId, function (err, response) {
            if(!err)
            {
                var lat = response.google.latitude;
                var lon = response.google.longitude;

                async.parallel({
                    wiki: function (cb) {
                        WikiManager.searchWiki(response.google.name, function (err, result) {
                            cb(null, result);
                        });
                    },
                    weather: function (cb) {
                        WeatherManager.getWeatherByLatLng(lat, lon,Constants.METRIC_TYPE.CELSIUS, function (err, result) {
                            cb(null, result);
                        });
                    },
                    attractions: function(cb)
                    {
                        if(response.google.placeType==Constants.PLACE_TYPE.LOCATION) {
                            Rome2RioManager.getThingsToDo({
                                lat: lat,
                                lon: lon
                            }, function (err, result) {
                                cb(null, result);
                            });
                        }
                        else
                            cb(null,null);
                    }
                }, function (err, results) {
                    response.weather = results.weather;
                    response.attractions = results.attractions;
                    response.wiki = results.wiki;
                    return utils.printResponse(res, response, "");
                });
            }
            else
                return utils.printError(res, err);
        });

    }
};