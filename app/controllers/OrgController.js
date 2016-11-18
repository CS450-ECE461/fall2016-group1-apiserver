var blueprint = require("@onehilltech/blueprint");
var ResourceController = require("./../../lib/ResourceController");
var Org = require("../models/Org");
var errors = require("../../lib/errors");

function OrgController() {
    ResourceController.call(this, {
        model: Org,
        authorize: {
            create: [
                function (request, response, next) {
                    if (!(request.user)) {
                        // User is not authenticated, cannot process request.
                        return next(new errors.AuthenticationError());
                    }

                    return next();
                }
            ]
        }
    });
}

blueprint.controller(OrgController, ResourceController);

module.exports = OrgController;