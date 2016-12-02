const blueprint = require("@onehilltech/blueprint");
const ResourceController = require("./../../lib/ResourceController");
const Message = require("../models/Message");
const passport = require("passport");

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
