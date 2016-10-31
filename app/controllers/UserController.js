var blueprint = require('@onehilltech/blueprint');
var mongodb = require('@onehilltech/blueprint-mongodb');
var Mongoose = require('mongoose');
var User = require('../models/User');
var _ = require('lodash');
var winston = require('winston');

function UserController() {
    blueprint.BaseController.call(this);
}

blueprint.controller(UserController);

UserController.prototype.__defineGetter__('resourceId', function () {
    return 'id'
});

UserController.prototype.create = function () {
    return function __UserController_create(request, response, next) {
        var doc;
        //noinspection JSCheckFunctionSignatures
        if (request.is('json')) {
            doc = request.body;
        }

        // Merge query string into User data
        _.defaultsDeep(doc, request.query);

        User.create(doc, function (error, result) {
            if (error) {
                return next(error);
            }

            response.format({
                default: function() {
                    response.json(result);
                }
            });

            return next();
        });
    }
};

UserController.prototype.get = function() {
    return function __UserController_get(request, response, next) {
        var criteria = {};
        try {
            criteria['_id'] = Mongoose.Types.ObjectId(request.params.id);

        } catch (error) {
            criteria['handle'] = request.params.id;
        }

        var projection = {
            "__v": 0,
            "password": 0
        };


        User.findOne(criteria, projection, function(error, result) {
            if (error) {
                return next(error);
            }

            if (!result) {
                error = new Error('User not found');
                error.status = 404;
                return next(error);
            }

            response.format({
                default: function() {
                    response.json(result);
                }
            });

            return next();
        });
    }
};

UserController.prototype.getAll = function () {
    return function __UserController_getAll(request, response, next) {

        if (request.query.limit) {
            if (limit > 100) {
                var error = new Error("'limit' must be less than 100");
                error.status = 400;
                return next(error);
            }
        }

        User.count({}, function(error, count) {
            if (error) {
                return next(error);
            }

            var conditions = _.omit(request.query, ['skip', 'limit']);

            var projection = {
                '__v': 0,
                'password': 0
            };

            var options = {
                skip: 0,
                limit: 20
            };

            _.defaults(options, _.pick(request.query, ['skip', 'limit']));

            User.find(conditions, projection, options, function(error, results) {
                if (error) {
                    return next(error);
                }

                var result = {
                    count: count,
                    skip: options.skip,
                    limit: options.limit
                };

                result[User.modelName] = results;

                response.status(200);

                response.format({
                    default: function() {
                        response.json(result);
                    }
                });

                return next();
            })
        });
    }
};


UserController.prototype.update = function() {
    return function __UserCollection_update(request, response, next) {
        var doc;
        //noinspection JSCheckFunctionSignatures
        if (request.is('json')) {
            doc = request.body;
        }

        // Merge query string into User data
        _.defaultsDeep(doc, request.query);

        request.params.id = Mongoose.Types.ObjectId(request.params.id);

        User.findByIdAndUpdate(request.params.id, { $set: doc }, function (error, result) {
            if (error) {
                return next(error);
            }

            if (!result) {
                // Try again, finding by 'handler'
                User.findOneAndUpdate({ handle: request.params.id }, { $set: doc }, function(error, result) {
                    if (error) {
                        return next(error);
                    }

                    if (!result) {
                        error = new Error();
                        error.status = 404;
                        return next(error);
                    }

                    response.status(200).json(result);
                    return next();
                });
            }
        });
    }
};

UserController.prototype.delete = function() {
    return function __UserCollection_delete(request, response, next) {
       var objectID = Mongoose.Types.ObjectId(request.params.id);

        User.findByIdAndRemove(objectID, function (error, result) {
            if (error) {
                next(error);
            }

            if (!result) {
                // Try again, finding by 'handle'
                User.findOneAndRemove({ handle: request.params.id }, function(error) {
                    if (error) {
                        next(error);
                    }

                    response.status(200).json({});
                    next();
                });
            }
        });
    };
};

module.exports = exports = UserController;
