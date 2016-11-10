var blueprint = require('@onehilltech/blueprint');
var Mongoose = require('mongoose');
var BaseController = blueprint.BaseController;
var util = require('util');
var _ = require('lodash');
var debug = require('debug')('ResourceController');
var async = require('async');
var pluralize = require('pluralize');
var errors = require('./errors');

/**
 * @class ResourceController
 *
 * @param options {Object} Options for the ResourceController, such as 'model'.
 * @constructor
 */

function ResourceController(options) {
    debug("new");
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

    this.plural = options.plural || pluralize.plural(this.model.modelName);
    debug("plural of " + this.model.modelName + " is " + this.plural);

    this.singular = options.singular || pluralize.singular(this.plural);
    debug("singular of " + this.model.modelName + " is " + this.singular);

    this.uniques = [];

    _.each(this.model.schema.paths, function(definition) {
        if (definition.path == "_id") {
            self.uniques.unshift(definition.path);
        } else if (definition.options.index && definition.options.index.unique) {
            self.uniques.push(definition.path);
        } else if (definition.options.unique) {
            self.uniques.push(definition.path);
        }
    });

    debug("uniques: " + this.uniques);
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

ResourceController.prototype.findOneByUnique = function(value, projection, callback) {
    var self = this;

    try {
        value = Mongoose.Types.ObjectId(value);
    } catch (err) {
        debug("findOneByUnique: value is not ObjectId");
    }

    var len = this.uniques.length;
    _.find(this.uniques, function(field) {
        var criteria = {};
        criteria[field] = value;

        self.model.findOne(criteria, projection, function(error, result) {
            if (error && !(error.name == "CastError")) {
                return callback(errors.normalizeError(error));
            }

            if (result) {
                return callback(null, result);
            } else {
                len = len - 1;

                if (len == 0) {
                    return callback(null, null);
                }
            }
        })
    })
};

ResourceController.prototype._create = function (request, response, next) {
    // Try converting `_id` to a MongoDB ObjectId
    if (request.body._id) {
        try {
            request.body._id = Mongoose.Types.ObjectId(request.body._id);
        } catch (err) {
            // ignored
        }
    }

    var self = this;

    this.model.create(request.body[this.singular], function (error, result) {
        if (error) {
            return next(errors.normalizeError(error));
        }

        request.params._id = result._id;

        var projection = {
            "__v": 0,
            "password": 0
        };

        self.findOneByUnique(result._id, projection, function (error, result) {
            if (error) {
                return next(errors.normalizeError(error));
            }

            response.status(201);

            var doc = {};
            doc[self.singular] = result;

            response.format({
                default: function () {
                    response.json(doc);
                }
            });

            return next();
        });

    });
};

ResourceController.prototype._get = function (request, response, next) {
    var projection = {
        "__v": 0,
        "password": 0
    };


    var self = this;
    this.findOneByUnique(request.params.id, projection, function (error, result) {
        if (error) {
            return next(error);
        }

        if (!result) {
            return next(new errors.NotFoundError());
        }

        var doc = {};
        doc[self.singular] = result;

        response.format({
            default: function () {
                response.status(200).json(doc);
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

            result[self.plural] = results;

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
    var self = this;

    this.findOneByUnique(request.params.id, {}, function (error, result) {
        if (error) {
            return next(errors.normalizeError(error));
        }

        if (!result) {
            return next(errors.normalizeError(error));
        }

        var options = {
            runValidators: true,
            fields: request.body[self.singular]
        };

        self.model.findOneAndUpdate({ _id: result._id }, request.body[self.singular], options, function(error) {
            if (error) {
                return next(errors.normalizeError(error));
            }

            return self._get(request, response, next);
        })
    });
};

ResourceController.prototype._delete = function (request, response, next) {
    var self = this;
    this.findOneByUnique(request.params.id, {}, function(error, result) {
        if (error) {
            return next(errors.normalizeError(error));
        }

        self.model.remove({_id: result._id}, function(error) {
            if (error) {
                return next(errors.normalizeError(error));
            }

            response.status(204).send();
        })
    });
};

module.exports = ResourceController;
