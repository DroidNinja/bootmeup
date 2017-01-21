'use strict';

/**
* Module dependencies.
*/
module.exports = function(app, express) {

    var AuthController = require('../controllers/AuthController');
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



    });

    app.use(api);
};

