"use strict";

var _ = require('lodash');

module.exports.RequestError = function RequestError(message, status, code, path) {
    Error.captureStackTrace(this, this.constructor);

    if (this.constructor.name === "RequestError") {
        this.name = "ServerError"
    } else {
        this.name = this.constructor.name;
    }
    this.message = message || "Server error";
    this.status = status || 500;
    this.code = code || this.status;
    this.path = path;
};


require('util').inherits(module.exports.RequestError, Error);

// All Error subclasses in this directory, in alphabetical order
var AuthenticationError = module.exports.AuthenticationError = require('./AuthenticationError');
var BadRequestError = module.exports.BadRequestError = require('./BadRequestError');
var DuplicateError = module.exports.DuplicateError = require('./DuplicateError');
var NotFoundError = module.exports.NotFoundError = require('./NotFoundError');
var ValidationError = module.exports.ValidationError = require('./ValidatorError');


/**
 * Normalize an already existing Error object into a standardized, response-ready Error object.
 *
 * @param errorObject {Error} The existing error object.
 */
module.exports.normalizeError = function normalizeError(errorObject) {
    if (errorObject instanceof module.exports.RequestError) {
        return errorObject;
    }

    var name = errorObject.name;

    if (name == "ValidationError") {
        if (errorObject.errors) {
            var errors = [];

            _.each(errorObject.errors, function (error) {
                errors.push(new ValidationError(error.message, error.status, error.code, error.path));
            });

            return errors;
        } else {
            return new ValidationError(errorObject.message, errorObject.status, errorObject.code, errorObject.path);
        }
    }

    if (name == "MongoError") {
        if (errorObject.code === (11000 || 11001)) {
            return new DuplicateError(null, null, errorObject.code, errorObject.path);
        }
    }

    return new module.exports.RequestError(errorObject.message, errorObject.status, errorObject.code, errorObject.path);

};
