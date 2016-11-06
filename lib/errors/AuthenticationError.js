"use strict";

const DEFAULT_STATUS = 422;

var RequestError = require('./').RequestError;

module.exports = function AuthenticationError(message, status, code, errors) {
    RequestError.apply(this, [
        message || "Invalid credentials",
        status || DEFAULT_STATUS,
        code || status || DEFAULT_STATUS,
        errors
    ]);
};

require('util').inherits(module.exports, RequestError);