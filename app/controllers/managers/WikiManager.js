/**
 * Created by droidNinja on 20/01/17.
 */

const _ = require("lodash");
const axios = require("axios");
const utils = require("../../utils/utils");
const Constants = require("../../constants/Constants");
const async = require("async");
const BASE_URL = "https://en.wikipedia.org/w/api.php";


module.exports = {
    getWikiInfo : function (req, res) {

        if(_.isUndefined(req.query.search))
            return utils.printError(res, Constants.ERROR_TYPE.INVALID_PARAMETERS);

        var search = req.query.search;
        searchWiki(search, function (err, result) {
           if(!err)
           {
               return utils.printResponse(res, result, "");
           }
            else
           utils.printError(res, err);
        });

    },
    searchWiki: function (name, done) {
        searchWiki(name,done);
    }
};

var searchWiki = function (name, done) {
    var URL = BASE_URL + "?action=opensearch&search="+name+"&limit=10&namespace=0&format=json";
    console.log(URL);
    axios.get(URL)
        .then(function (response) {
            console.log(response.data);
            done(null,parseData(response.data));
        })
        .catch(function (error) {
            done(error,null);
        });
};

var parseData = function (data) {
    if(_.isUndefined(data) || _.isNull(data))
        return null;

    if(data.length==4){
        var wiki = {};
        wiki.description = data[2][0];
        wiki.wikiURL = data[3][0];
        return wiki;
    }
    return null;
};