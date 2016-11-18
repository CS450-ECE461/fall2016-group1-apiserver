
const DEFAULT_STATUS = 422;

var RequestError = require("./").RequestError;

module.exports = function AuthenticationError (message, status, code, path) {
  RequestError.apply(this, [
    message || "Invalid credentials",
    status || DEFAULT_STATUS,
    code || status || DEFAULT_STATUS,
    path
  ]);
};

require("util").inherits(module.exports, RequestError);
