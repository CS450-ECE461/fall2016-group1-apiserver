// Error handling via Express
const _ = require("lodash");
const winston = require("winston");

function handleError (error, request, response, next) {
  // noinspection JSUnresolvedVariable
  /* istanbul ignore if  */
  if (response.headersSent) {
    return next(error);
  }

  let errors = [];
  if (error instanceof Array) {
    errors = error;
  } else {
    errors.push(error);
  }

  _.each(errors, function (err) {
    /* istanbul ignore if  */
    if (!err.status || err.status === (500)) {
      winston.log("error", err.stack);
    }

    /* istanbul ignore if  */
    if (err.statusCode && !(err.status)) {
      err.status = err.statusCode;
    }

    /* istanbul ignore if  */
    if (err.statusCode) {
      delete err.statusCode;
    }
  });

  response.format({
    json: function () {
      response.status(errors[0].status || 500).json({errors: errors});
    },
    default: function () {
      /* istanbul ignore next  */
      response.status(errors[0].status || 500).send();
    }
  });
}

module.exports = function (blueprint) {
  const express = blueprint.server.app;
  express.set("json spaces", 2);
  express.use(handleError);
};
