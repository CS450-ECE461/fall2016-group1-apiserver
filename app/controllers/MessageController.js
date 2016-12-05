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
          if (req.body.message) {
            req.body.message.sender = req.user._id;
          } else { return res.sendStatus(400); }
          next();
        }
      ]
    }
  });
}

blueprint.controller(MessageController, ResourceController);

module.exports = MessageController;
