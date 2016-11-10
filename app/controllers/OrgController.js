var blueprint = require('@onehilltech/blueprint');
var ResourceController = require('./../../lib/ResourceController');
var Org = require('../models/Org');
var _ = require('lodash');

function OrgController() {
    ResourceController.call(this, {
        model: Org,
        normalize: {
            create: [
                function (request, response, next) {
                    // Merge query string into Resource document
                    _.defaultsDeep(request.body, request.query);

                    next();
                }
            ],
            any: [
                function (request, response, next) {
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

blueprint.controller(OrgController, ResourceController);

module.exports = OrgController;