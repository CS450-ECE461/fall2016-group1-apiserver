var blueprint = require('@onehilltech/blueprint');
var Mongoose = require('mongoose');
var BaseController = blueprint.BaseController;
var util = require('util');
var _ = require('lodash');
var debug = require('debug')('ResourceController');
var async = require('async');
var errors = require('./errors');

/**
 * @class ResourceController
 *
 * @param options {Object} Options for the ResourceController, such as 'model'.
 * @constructor
 */

function ResourceController(options) {
    BaseController.call(this);

    options = options || {};

    if (!options.model) {
        throw new Error("'model' property must be defined in 'options' parameter")
    }

    this.model = options.model;

    this.hooks = {
        /**
         * By default, hooks are executed synchronously in this order:
         * - normalize.<operation>
         * - normalize.any
         * - authorize.any
         * - authorize.<operation>
         * - pre.any
         * - pre.<operation>
         * - execute.<operation>
         * - post.<operation>
         * - post.any
         *
         * Handlers are compiled in `compileHandlers()` method.
         */
        normalize: {
            create: [],
            get: [],
            getAll: [],
            update: [],
            delete: [],
            any: []
        },

        authorize: {
            any: [],
            create: [],
            get: [],
            getAll: [],
            update: [],
            delete: []
        },

        pre: {
            any: [],
            create: [],
            get: [],
            getAll: [],
            update: [],
            delete: []
        },

        execute: {
            create: this._create,
            get: this._get,
            getAll: this._getAll,
            update: this._update,
            delete: this._delete
        },

        post: {
            create: [],
            get: [],
            getAll: [],
            update: [],
            delete: [],
            any: []
        }
    };

    var self = this;
    _.each(Object.keys(this.hooks), function(key) {
        if (options[key]){
            if (options[key] === "object") {
                self.hooks[key].any.push(options[key]);
            } else {
                _.defaultsDeep(self.hooks[key], options[key]);
            }
        }
    });
}

util.inherits(ResourceController, BaseController);

ResourceController.prototype.__defineGetter__('resourceId', function () {
    return 'id';
});

ResourceController.prototype.create = function () {
    return this.task('create');
};

ResourceController.prototype.get = function () {
    return this.task('get');
};

ResourceController.prototype.getAll = function () {
    return this.task('getAll');
};

ResourceController.prototype.update = function () {
    return this.task('update');
};

ResourceController.prototype.delete = function () {
    return this.task('delete');
};

ResourceController.prototype.compileHandlers = function(operation) {
    var hooks = this.hooks;

    return _.concat(
        hooks.normalize[operation],
        hooks.normalize.any,
        hooks.authorize.any,
        hooks.authorize[operation],
        hooks.pre.any,
        hooks.pre[operation],
        hooks.execute[operation],
        hooks.post[operation],
        hooks.post.any
    );
};

ResourceController.prototype.task = function (operation) {
    var handlers = this.compileHandlers(operation);

    var self = this;

    return function __ResourceController_executeTask(request, response, next) {
        async.eachSeries(handlers, function(listener, callback) {
            if (listener) {
                listener.apply(self, [request, response, callback]);
            } else {
                callback();
            }
        }, function __ResourceController_handleTaskError(error) {
            if (error) {
                return next(error);
            }

            return next();
        });
    }
};

ResourceController.prototype._create = function (request, response, next) {
    // Try converting `_id` to a MongoDB ObjectId
    if (request.body._id) {
        try {
            request.body._id = Mongoose.Types.ObjectId(request.body._id);
        } catch (err) {
            var error = err;
            err.status = 400;
            return next(error);
        }
    }

    var self = this;

    this.model.create(request.body, function (error, result) {
        if (error) {
            return next(errors.normalizeError(error));
        }

        request.params._id = result._id;

        var projection = {
            "__v": 0,
            "password": 0
        };

        self.model.findOne({ _id: result.id}, projection, function (error, result) {
            if (error) {
                return next(errors.normalizeError(error));
            }

            if (!result) {
                return next(new errors.NotFoundError);
            }

            response.status(201);

            response.format({
                default: function () {
                    response.json(result);
                }
            });

            return next();
        });

    });
};

ResourceController.prototype._get = function (request, response, next) {
    var criteria = {};

    try {
        debug('checking request.params.id for _id');
        criteria['_id'] = Mongoose.Types.ObjectId(request.params.id);

    } catch (error) {
        debug('checking request.params.id for handle');
        criteria['handle'] = request.params.id;
    }

    var projection = {
        "__v": 0,
        "password": 0
    };


    var self = this;
    this.model.findOne(criteria, projection, function (error, result) {
        if (error) {
            return next(error);
        }

        if (!result) {
            return next(new errors.NotFoundError());
        }

        response.format({
            default: function () {
                response.json(result);
            }
        });

        return next();
    });
};


ResourceController.prototype._getAll = function (request, response, next) {

    if (request.query.limit) {
        if (limit > 100) {
            var error = new Error("'limit' must be less than 100");
            error.status = 400;
            return next(error);
        }
    }

    var self = this;

    this.model.count({}, function (error, count) {
        if (error) {
            return next(errors.normalizeError(error));
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

        _.defaultsDeep(options, _.pick(request.query, ['skip', 'limit', 'sort']));

        self.model.find(conditions, projection, options, function (error, results) {
            if (error) {
                return next(errors.normalizeError(error));
            }

            var result = {
                count: count,
                skip: options.skip,
                limit: options.limit
            };

            result[self.model.modelName] = results;

            response.status(200);

            response.format({
                default: function () {
                    response.json(result);
                }
            });

            return next();
        })
    });
};


ResourceController.prototype._update = function (request, response, next) {
    var criteria = {};

    try {
        debug('checking request.params.id for _id');
        criteria['_id'] = Mongoose.Types.ObjectId(request.params.id);

    } catch (error) {
        debug('checking request.params.id for handle');
        criteria['handle'] = request.params.id;
    }

    debug(criteria);

    debug("checking for `_id` or `id` in body");
    if (request.body._id || request.body.id) {
        var error = new Error();
        error.title = "Bad Request";
        error.paths = {};
        msg = "Update of path is not allowed: ";

        if (request.body._id) {
            debug("disallow update of `_id`");
            error.paths._id.message = msg + "`_id`";
        } else {
            debug("disallow update of id");
            error.paths.id.message = msg + "`id`";
        }

        return next(error);
    }

    var projection = {};

    _.each(Object.keys(request.body), function(key) {
        debug("field `" + key + "` specified");
        projection[key] = 1;
    });


    var self = this;

    this.model.findOne(criteria, projection, function (error, result) {
        if (error) {
            return next(error);
        }

        _.each(Object.keys(request.body), function(key) {
            debug("updating path `" + key + "`");
            result[key] = request.body[key];
        });

        debug("saving updated doc");
        result.save(function(error) {
            if (error) {
                debug("error on save: " + error.message);
                return next(errors.normalizeError(error));
            }

            debug("doc saved");

            projection = {
                "__v": 0,
                "password": 0
            };

            self._get(request, response, next);
        });
    });
};

ResourceController.prototype._delete = function (request, response, next) {
    var criteria = {};

    try {
        criteria['_id'] = Mongoose.Types.ObjectId(request.params.id);

    } catch (error) {
        criteria['handle'] = request.params.id;
    }

    this.model.findOneAndRemove(criteria, function (error) {
        if (error) {
            return next(errors.normalizeError(error));
        }

        response.status(204).send();
        return next();
    });
};

module.exports = ResourceController;
