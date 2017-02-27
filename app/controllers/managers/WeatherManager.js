/**
 * Created by droidNinja on 20/01/17.
 */

const _ = require("lodash");
const axios = require("axios");
const utils = require("../../utils/utils");
const Constants = require("../../constants/Constants");
const async = require("async");
var URL = "http://api.openweathermap.org/data/2.5/weather?APPID=6a8f6d36f6fad9b6e358f27653e7c521";

module.exports = {
    getWeatherByLatLng : function (lat, lon, metric, done) {

        var unit = "imperial";
        if(metric==Constants.METRIC_TYPE.CELSIUS)
            unit = "metric";


        URL +="&lat="+lat+"&lon="+lon+"&units="+unit;
        axios.get(URL)
            .then(function (response) {
                console.log(response.data);
                done(null, parseWeatherData(response.data, metric))
            })
            .catch(function (error) {
                done(error,null);
            });
    }
};

var parseWeatherData = function (data, metric) {
  if(!_.isUndefined(data) && _.isNull(data))
  {
      return null;
  }

    var weather = {};
    weather.temp = data.main.temp;
    weather.temp += (metric==Constants.METRIC_TYPE.CELSIUS)?" °C":" °F";
    weather.description = data.weather[0].description;
    weather.icon = data.weather[0].icon; //TODO

    return weather;
};