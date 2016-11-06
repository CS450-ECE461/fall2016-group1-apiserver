// Error handling via Express
var _ = require('lodash');
var winston = require('winston');
var errors = require('../../../lib/errors');

function handleError(error, request, response, next) {
    if (response.headersSent) {
        return next(err);
    }

    if (!error instanceof errors.RequestError) {
        error = errors.normalizeError(error);
    }

    response.format({
        json: function() {
            response.status(error.status).json({errors: [error.errors]});
        },
        default: function() {
            response.status(error.status).send();
        }
    });
}

module.exports = function(blueprint) {
    var express = blueprint.server.app;
    express.set('json spaces', 2);
    express.use(handleError);
};