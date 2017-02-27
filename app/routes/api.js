'use strict';

/**
* Module dependencies.
*/
module.exports = function(app, express) {

    //var AuthController = require('../controllers/AuthController');
    var Rome2RioManager = require('../controllers/location/Rome2RioManager');
    var GooglePlacesManager = require('../controllers/location/GooglePlacesManager');
    var ZomatoScraper = require('../controllers/location/ZomatoScraper');
    var LocationController = require('../controllers/LocationController');
    var WikiManager = require('../controllers/managers/WikiManager');
    var utils = require('../utils/utils');
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();

    var api = express.Router();
    api.group("/api/v1", function (router) {

        router.get("/test", function (req, res) {
            utils.printResponse(res,{},"okaayy biatch");
        });

        //router.post("/signUp", ValidationManager.validateRegistrationData, AuthController.signUp);
        //router.post("/login", ValidationManager.login, AuthController.login);

        router.get("/rome2rio", Rome2RioManager.validateRequest,Rome2RioManager.getNearbyAttractions);

        router.get("/restaurants", GooglePlacesManager.validateRequest,GooglePlacesManager.getRestaurants);

        router.get("/g/place", GooglePlacesManager.getPlaceInfoByPlaceId);

        router.get("/place", LocationController.getLocationInfo);

        router.get("/wiki", WikiManager.getWikiInfo);

        router.get("/restaurants/top", GooglePlacesManager.getTopRestaurants);

        router.get("/zomato", ZomatoScraper.validateRequest);

        router.get("/zomato/find", ZomatoScraper.findRestaurantUrl);

    });

    app.use(api);
};

