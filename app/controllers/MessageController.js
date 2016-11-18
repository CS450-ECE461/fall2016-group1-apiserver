"use strict";

function MessageController() {
  blueprint.BaseController.call(this);
}

blueprint.controller(MessageController);

MessageController.prototype.getMessages = function () {
  return function (req, res) {
    if (!req.user) {
      return res.status(401).json({ error: "Invalid Token." });
    }
    // Get messages and return
  };
}

MessageController.prototype.sendMessage = function () {
  return function (req, res) {
    if (!req.user) {
      return res.status(401).json({ error: "Invalid Token." });
    }
    // Send a message
  };
}

module.exports = MessageController;

