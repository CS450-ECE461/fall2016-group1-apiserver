"use strict";

// All Error subclasses in this directory, in alphabetical order
var AuthenticationError = module.exports.AuthenticationError = require('./AuthenticationError');
var DuplicateError = module.exports.DuplicateError = require('./DuplicateError');
var NotFoundError = module.exports.NotFoundError = require('./NotFoundError');
var ValidationError = module.exports.ValidationError = require('./ValidationError');

module.exports.RequestError = function RequestError(message, status, code, errors) {
    Error.captureStackTrace(this, this.constructor);

    if (this.constructor.name === "RequestError") {
        this.name = "ServerError"
    } else {
        this.name = this.constructor.name;
    }
    this.message = message || "Server error";
    this.status = status || 500;
    this.code = code || this.status;

    this.errors = [];

    if (!errors) {
        errors = [];
        errors[0] = {
            name: this.name,
            message: this.message,
            code: this.code
        };
    }

    var self = this;
    _.each(errors, function(err) {
        error = {};

        error.name = err.name || self.name;
        error.path = err.path;
        error.message = err.message || self.message;
        error.type = err.type;


        self.errors.push(error);
    });
};

require('util').inherits(module.exports.RequestError, Error);


/**
 * Normalize an already existing Error object into a standardized, response-ready Error object.
 *
 * @param errorObject {Error} The existing error object.
 */
module.exports.normalizeError = function normalizeError (errorObject) {
    var name = errorObject.name;



    if (name == "ValidationError") {
        return new ValidationError(null, errorObject.errors || []);
    }

    if (name == "MongoError") {
        if (errorObject.code === (11000 || 11001)) {
            return new DuplicateError(null, errorObject.code);
        }
    }

    return new RequestError(errorObject.message, errorObject.status, errorObject.code, errorObject.message);

};