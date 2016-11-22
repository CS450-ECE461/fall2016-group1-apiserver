var blueprint = require("@onehilltech/blueprint");
var ResourceController = require("./../../lib/ResourceController");
var Message = require("../models/Message");
var passport = require("passport");

function MessageController () {
  // noinspection JSUnresolvedFunction
  ResourceController.call(this, {
    model: Message,
    authorize: {
      any: [
        passport.authenticate("jwt", { session: false })
      ],
      create: [
        function (req, res, next) {
          req.body.message.sender = req.user._id;
          next();
        }
      ]
    }
  });
}

blueprint.controller(MessageController, ResourceController);

module.exports = MessageController;
