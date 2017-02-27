/**
 * Created by droidNinja on 17/02/17.
 */
const _ = require("lodash");
const axios = require("axios");
const utils = require("../../utils/utils");
const Constants = require("../../constants/Constants");
const async = require("async");
const XRAY = require("x-ray");
var request = require('request');

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

const options = {
    method: "GET",                      //Set HTTP method
    jar: true,                          //Enable cookies
    headers: {                          //Set headers
        'Host': 'www.zomato.com',
        'User-Agent': 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    }
};

const driver = makeDriver(options)  ;    //Create driver

var cookies = {
    'fbcity': '3',
    'zl': 'en',
    'fbtrack': '348ec2207b3d6c55a7ca231d677e419a',
    '_ga': 'GA1.2.1124886037.1475382045',
    'dpr': '1',
    'fbm_288523881080': 'base_domain=.zomato.com',
    'zhli': '1',
    'squeeze': 'e6c1d9490c106fc68a20b1907a41e849',
    'orange': '5768794',
    '__utmx': '141625785.FQnzc5UZQdSMS6ggKyLrqQ$0:',
    '__utmxx': '141625785.FQnzc5UZQdSMS6ggKyLrqQ$0:1486207870:8035200',
    'PHPSESSID': '1549cf5ac03934a92c821460668aa0a21c9e8972',
    '__jpuri': 'https%3A//www.zomato.com/mumbai/lunch',
};

module.exports = {

    validateRequest: function (req, res) {
        scraper.driver(driver);
        getRestaurantDetail(req.query.url, function (err, result) {
            if(!err)
            {
                return utils.printResponse(res, result,"");
            }
            else
                return utils.printError(res, err);
        });
    },
    findRestaurantUrl: function (req, res) {
        getRestaurantInfo(req.query.name,req.query.city, function (err, results) {
            if(!err)
            {
                return utils.printResponse(res, results,"");
            }
            else
                return utils.printError(res, err);
        });
    },
    getRestaurantInfo: function (name, city, done) {
        getRestaurantInfo(name,city, function (err, results) {
            if(!err)
            {
                done(null, results);
            }
            else
                done(err, null);
        });
    }

};

var getRestaurantInfo  = function (name, city, done) {
    scraper.driver(driver);
    var url = "https://www.zomato.com/"+getCityName(city)+"/restaurants?q="+name;
    console.log(url);

    scraper(encodeURI(url),{
        name: ['.result-title | trim'],
        link: ['.result-title@href'],
        locality: ['.search_result_subzone'],
        queryLink: 'link[hreflang="en"]@href'
    })(function(err, info) {
        console.log(info);

        //done(null, info);
        var text = info.queryLink.split("/");
        if(_.isEqual(info.queryLink, url) || text.length>5)
        {

            var isURLMatched = false;
            //then it is search
            for(var index=0;index<info.name.length;index++)
            {
                if(checkIfKeywordsMatched(_.toLower(info.name[index]), _.toLower(name)))
                {
                    isURLMatched = true;
                    getRestaurantDetail(info.link[index],done);
                    break;
                }
            }

            if(!isURLMatched)
            {
                done("Cannot found restaurant", null);
            }

        }
        else {
            //else it is restaurant url

            getRestaurantDetail(info.queryLink, done);

        }

    });
};

var getRestaurantDetail = function (url, done) {
    console.log("getRestaurantDetail: "+ url);
    scraper(url,{
        name: '.res-name | trim',
        cost: '.res-info-detail span[aria-label]',
        cuisines: scraper('.res-info-cuisines', ['a'])
    })(function(err, info) {
        if(!err) {
            getRestaurantMenus(url, function (err, menus) {
                info.menus = menus;
                done(err, info);
            });
        }
        else
            done(err, null);
    });

};

var getRestaurantMenus = function (url, done) {
    var menuImages = [];

    scraper(url+"/menu#tabtop",{
        menu: '#menu-image img@src',
        maxNum: '.pagination-meta div | trim | reverse'
    })(function(err, result) {

        console.log(result);
        menuImages.push(result.menu);
        //done(null, menuImages);
        //return;
        var max = result.maxNum.split(' ');
        if(_.isEmpty(max))
        {
            done(null, menuImages);
            return;
        }
        var numOfPages = parseInt(max[0]);
        if(numOfPages>1)
        {
            var urls = [];
            for(var index=2;index<=numOfPages;index++)
            {
                urls.push(url+"/menu?page="+ index +"#menutop");
            }
            //done(null, menuImages);
            //return;
            async.each(urls,

                function(url, callback){
                    scraper(url,{
                        menu: '#menu-image img@src'
                    })(function(err, result) {
                        if(!_.isUndefined(result.menu))
                        {
                            menuImages.push(result.menu);
                        }
                        callback();
                    });

                },

                function(err){
                    done(null, menuImages);
                }
            );
        }
        else
            done(null, menuImages);

    });
};

var getCityName = function (name) {
    var city = _.toLower(name);
    if(_.includes(city, _.toLower("Delhi")) ||
        _.includes(city,_.toLower("Gurugram")) ||
        _.includes(city,_.toLower("Noida")))
        return "ncr";
    return city;
};

var checkIfKeywordsMatched = function (text, query) {
    if(_.isUndefined(text) || _.isUndefined(query))
        return false;

    var keywords = text.split(" ");
    var quer = query.split(" ");

    return utils.arrayContainsAnotherArray(quer,keywords);
};