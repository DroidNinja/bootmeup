'use strict';

/**
* Module dependencies.
*/
module.exports = function(app, express) {


    var AuthController = require('../controllers/AuthController');
    var ValidationManager = require('../controllers/managers/ValidationManager');
    var utils = require('../utils/utils');
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();

    var api = express.Router();
    api.group("/api/v1", function (router) {

        router.get("/test", function (req, res) {
            utils.printResponse(res,{},"okaayy biatch");
        });

        router.post("/signUp", ValidationManager.validateRegistrationData, AuthController.signUp);

    });

    app.use(api);
};

