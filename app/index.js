#!/usr/bin/env node

const winston = require("winston");
const blueprint = require("@onehilltech/blueprint");

blueprint.Application(__dirname, function (err, app) {
  if (err) throw err;

  app.start(function (err) {
    if (err) throw err;

    winston.log("info", "application started...");
  });
});
