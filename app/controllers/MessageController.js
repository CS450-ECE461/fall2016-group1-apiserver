var blueprint = require("@onehilltech/blueprint");
var ResourceController = require("./../../lib/ResourceController");
var Message = require("../models/Message");
var passport = require("passport");

function MessageController () {
  // noinspection JSUnresolvedFunction
  ResourceController.call(this, {
    model: Message,
    authorize: {
      create: [
        passport.authenticate("jwt", { session: false })
      ],
      update: [
        passport.authenticate("jwt", { session: false })
      ]
    }
  });
}

blueprint.controller(MessageController, ResourceController);

module.exports = MessageController;
