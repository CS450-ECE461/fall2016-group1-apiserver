var blueprint = require('@onehilltech/blueprint');
var mongodb = require('@onehilltech/blueprint-mongodb');
var ResourceController = mongodb.ResourceController;
var User = require('../models/User');
var _ = require('lodash');
var winston = require('winston');

var NotAcceptableError = function (details) {
    return {
        code: 406,
        message: "Not Acceptable",
        details: details
    }
};

var BadRequestError = function (details, path) {
    var result = {
        code: 400,
        message: "Bad Request",
        details: details
    };

    if (path) {
        result.path = path;
    }

    return result;
};

var ServerError = function(details) {
    var result = {
        code: 500,
        message: "Server Error"
    };

    if (details) {
        if (blueprint.env !== 'production') {
            result.details = details;
        }
    }

    winston.log('error', details);
    return result;
};

var NotFoundError = function(details) {
    var result = {
        code: 404,
        message: "Not Found"
    };

    if (details) {
        result.details = details;
    }
};

function buildMongooseError(error) {
    if (error.name === 'MongoError') {
        if (error.code === 11000 || error.code === 11001) {
            return BadRequestError("Duplicate key found", error.path);
        } else {
            return ServerError(error);
        }
    }

    else {
    //if (error.name === 'ValidationError' || error.name === 'CastError') {
        return BadRequestError(error.type || error.message, error.path);
    }
}

function UserController() {
    blueprint.BaseController.call(this);
}

blueprint.controller(UserController);

UserController.prototype.__defineGetter__('resourceId', function () {
    return 'id'
});

UserController.prototype.create = function () {
    return function __UserController_create(request, response, next) {
        winston.log('info', 'Began Creation');
        //noinspection JSUnresolvedFunction
        if (!request.accepts('json')) {
            response.status(406).json(new NotAcceptableError('Must accept JSON response body'));
            next();
        }

        var doc;
        //noinspection JSCheckFunctionSignatures
        if (request.is('json')) {
            doc = request.body;
        }

        // Merge query string into User data
        _.defaultsDeep(doc, request.query);

        User.create(doc, function (error, result) {
            winston.log('info', 'Creation attempt');
            if (error) {
                var errorObject = buildMongooseError(error);
                response.status(errorObject.code).json({error: errorObject});
                next();
            }

            response.status(200).json(result);
            next();
        });
    }
};

UserController.prototype.get = function() {
    return function __UserController_get(request, response, next) {
        //noinspection JSUnresolvedFunction
        if (!request.accepts('json')) {
            response.status(406).json({error: new NotAcceptableError('Must accept JSON response body')});
            next();
        }

        User.findById(request.params.id, function (error, result) {
            if (error) {
                var errorObject = buildMongooseError(error);
                response.status(errorObject.code).json({error: errorObject});
                next();
            }

            if (!result) {
                // Try again, finding by 'handler'
                User.findOne({ handler: request.params.id }, function(error, result) {
                    if (error) {
                        var errorObject = buildMongooseError(error);
                        response.status(errorObject.code).json({error: errorObject});
                        next();
                    }

                    if (!result) {
                        response.status(404).json(new NotFoundError());
                        next();
                    }

                    response.status(200).json(result);
                    next();
                });
            }
        });
    }
};

UserController.prototype.getAll = function () {
    return function __UserController_getAll(request, response, next) {
        //noinspection JSUnresolvedFunction
        if (!request.accepts('json')) {
            response.status(406).json(new NotAcceptableError('Must accept JSON response body'));
        }

        var options = {};

        options.skip = request.params.skip || 0;
        options.limit = request.params.limit || 20;

        if (request.query.limit) {
            if (limit > 100) {
                response.status(400).json({ error: new BadRequestError('Cannot return more than 100 entries')});
                next();
            }
        }

        User.count({}, function(error, count) {
            if (error) {
                var errorObject = buildMongooseError(error);
                response.status(errorObject.code).json({error: errorObject});
                next();
            }

            if (count >= (skip)) {
                response.status(400).json({error: BadRequestError("'skip' query must be less than " + count)});
                next();
            }

            var filter = request.query.filter;

            User.find(filter, options, function(error, results) {
                if (error) {
                    var errorObject = buildMongooseError(error);
                    response.status(errorObject.code).json({error: errorObject});
                    next();
                }

                var data = {
                    count: count,
                    skip: options.skip,
                    limit: options.limit,
                    data: results
                };

                data[User.modelName] = results;
                response.status(200).json(results);
                next();
            })
        });
    }
};


UserController.prototype.update = function() {
    return function __UserCollection_update(request, response, next) {
        //noinspection JSUnresolvedFunction
        if (!request.accepts('json')) {
            response.status(406).json(new NotAcceptableError('Must accept JSON response body'));
            next();
        }

        var doc;
        //noinspection JSCheckFunctionSignatures
        if (request.is('json')) {
            doc = request.body;
        }

        // Merge query string into User data
        _.defaultsDeep(doc, request.query);

        User.findByIdAndUpdate(request.params.id, { $set: doc }, function (error, result) {
            if (error) {
                var errorObject = buildMongooseError(error);
                response.status(errorObject.code).json({error: errorObject});
                next();
            }

            if (!result) {
                // Try again, finding by 'handler'
                User.findOneAndUpdate({ handle: request.params.id }, { $set: doc }, function(error, result) {
                    if (error) {
                        var errorObject = buildMongooseError(error);
                        response.status(errorObject.code).json({error: errorObject});
                        next();
                    }

                    if (!result) {
                        response.status(404).json(new NotFoundError());
                        next();
                    }

                    response.status(200).json(result);
                    next();
                });
            }
        });
    }
};

UserController.prototype.delete = function() {
    return function __UserCollection_delete(request, response, next) {
        //noinspection JSUnresolvedFunction
        if (!request.accepts('json')) {
            response.status(406).json({error: new NotAcceptableError('Must accept JSON response body')});
            next();
        }

        User.findByIdAndRemove(request.params.id, function (error, result) {
            if (error) {
                var errorObject = buildMongooseError(error);
                response.status(errorObject.code).json({error: errorObject});
                next();
            }

            if (!result) {
                // Try again, finding by 'handle'
                User.findOneAndRemove({ handle: request.params.id }, function(error) {
                    if (error) {
                        var errorObject = buildMongooseError(error);
                        response.status(errorObject.code).json({error: errorObject});
                        next();
                    }

                    response.status(200).json({});
                    next();
                });
            }
        });
    };
};

module.exports = exports = UserController;
