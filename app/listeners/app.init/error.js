// Error handling via Express
var _ = require('lodash');
var winston = require('winston');

module.exports = function(blueprint) {
    var express = blueprint.server.app;

    express.set('json spaces', 2);

    express.use(function __handleError (err, request, response, next) {
        winston.log('error', err.stack);

        if (response.headersSent) {
            return next(err);
        }

        var error = {};

        switch(err.name) {
            case "ValidationError":
                error.status = 400;
                error.paths = {};

                _.each(err.errors, function(validation) {
                    error.paths[validation.path] = {
                        message: validation.message || null,
                        type: validation.type
                    }
                });
                break;

            default:
                if (err.name) {
                    error.message = err.name + ": " + err.message;
                } else {
                    error.message = err.message;
                }
        }

        error.status = error.status || err.status || 500;
        error.code = err.code || error.status;

        response.format({
            default: function() {
                response.status(error.status).json({error: error});
            }
        });

        next();

    });
};