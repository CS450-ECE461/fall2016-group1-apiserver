
const DEFAULT_STATUS = 422;

var RequestError = require("./").RequestError;

module.exports = function ValidatorError (message, status, code, path) {
  RequestError.apply(this, [
    message || "Validator error",
    status || DEFAULT_STATUS,
    code || status || DEFAULT_STATUS,
    path
  ]);
};

require("util").inherits(module.exports, RequestError);
