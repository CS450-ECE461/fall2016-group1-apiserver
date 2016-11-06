// Error handling via Express
var _ = require('lodash');
var winston = require('winston');
var errors = require('../../../lib/errors');

function handleError(error, request, response, next) {
    if (response.headersSent) {
        return next(err);
    }

    var errors = [];
    if (error instanceof Array) {
        errors = error;

        winston.log('error', error)
    } else {
        errors.push(error);
    }

    _.each(errors, function(error) {
        winston.log('error', error.stack);
    });

    console.log({errors: errors});

    response.format({
        json: function() {
            response.status(errors[0].status || 500).json({errors: errors});
        },
        default: function() {
            response.status(errors[0].status || 500).send();
        }
    });
}

module.exports = function(blueprint) {
    var express = blueprint.server.app;
    express.set('json spaces', 2);
    express.use(handleError);
};