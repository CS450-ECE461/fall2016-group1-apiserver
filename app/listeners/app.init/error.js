// Error handling via Express
var _ = require('lodash');
var winston = require('winston');

module.exports = function(blueprint) {
    var express = blueprint.server.app;

    express.set('json spaces', 2);

    express.use(function __handleError (err, request, response, next) {
        if (response.headersSent) {
            return next(err);
        }

        var error = {};

        //noinspection FallThroughInSwitchStatementJS
        switch(err.name) {
            case "ValidationError":
                error.status = 409;
                error.title = "Conflict";
                error.paths = {};

                _.each(err.errors, function(validation) {
                    error.paths[validation.path] = {
                        message: validation.message || null,
                        type: validation.type
                    }
                });
                break;

            case "MongoError":
                if (err.code == (11000 || 11001)) {
                    error.status = 409;
                    error.code = err.code;
                    error.title = "Conflict";
                    break;
                }

            default:
                if (err.name) {
                    error.message = err.name + ": " + err.message;
                } else {
                    error.message = err.message;
                }
        }

        error.status = error.status || err.status || 500;
        error.code = err.code;

        if (err.status == 500) {
            winston.log('error', err.stack);
        }

        response.format({
            default: function() {
                response.status(error.status).json({errors: [error]});
            }
        });

        next();

    });
};