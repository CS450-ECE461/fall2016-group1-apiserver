// Error handling via Express
var _ = require('lodash');
var winston = require('winston');

function handleError(error, request, response, next) {
    //noinspection JSUnresolvedVariable
    if (response.headersSent) {
        return next(error);
    }

    var errors = [];
    if (error instanceof Array) {
        errors = error;
    } else {
        errors.push(error);
    }

    _.each(errors, function (err) {
        if (!err.status || err.status === (500)) {
            winston.log('error', err.stack);
        }

        if (err.statusCode && !(err.status)) {
            err.status = err.statusCode;
        }

        if (err.statusCode) {
            delete err.statusCode;
        }
    });


    response.format({
        json: function () {
            response.status(errors[0].status || 500).json({errors: errors});
        },
        default: function () {
            response.status(errors[0].status || 500).send();
        }
    });
}

module.exports = function (blueprint) {
    var express = blueprint.server.app;
    express.set('json spaces', 2);
    express.use(handleError);
};
