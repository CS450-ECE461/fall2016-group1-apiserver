var blueprint = require('@onehilltech/blueprint');
var ResourceController = require('./../../lib/ResourceController');
var User = require('../models/User');
var _ = require('lodash');

function UserController() {
    ResourceController.call(this, {
        model: User,
        normalize: {
            create: [
                function __UserController_normalize_create (request, response, next) {
                    // Merge query string into Resource document
                    _.defaultsDeep(request.body, request.query);
                    console.log('merge');

                    next();
                }
            ],
            any: [
                function __UserController_normalize_any (request, response, next) {
                    // Override `_id` with `id` if `_id` does not exist
                    if (request.body.id && !request.body._id) {
                        request.body._id = request.body.id;
                    }

                    // Delete `id`, even if `_id` already existed
                    if (request.body.id) {
                        delete request.body.id;
                    }

                    return next();
                }
            ]
        }
    });
}

blueprint.controller(UserController, ResourceController);

module.exports = UserController;
