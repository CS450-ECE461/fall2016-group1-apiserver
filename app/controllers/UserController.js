var blueprint = require('@onehilltech/blueprint');
var ResourceController = require('./../../lib/ResourceController');
var User = require('../models/User');
var _ = require('lodash');

function UserController() {
    ResourceController.call(this, {
        model: User,
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

blueprint.controller(UserController, ResourceController);

UserController.prototype.showMe = function () {
    return function (req, res) {
        if (!req.user) {
            return res.status(401).json({error: 'Invalid Token.'});
        }
        res.json(req.user.toJSON());
    }
};

module.exports = UserController;
