const blueprint = require("@onehilltech/blueprint");
const ResourceController = require("./../../lib/ResourceController");
const Message = require("../models/Message");
const passport = require("passport");
const mongoose = require("mongoose");

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
    },
    normalize: {
      getAll: [function (req, res, next) {
        if (req.query.channel) {
          req.query.channel = mongoose.Types.ObjectId(req.query.channel);
        }
        next();
      }],
      get: [function (req, res, next) {
        if (req.query.channel) {
          req.query.channel = mongoose.Types.ObjectId(req.query.channel);
        }
        next();
      }]
    }
  });
}

blueprint.controller(MessageController, ResourceController);

module.exports = MessageController;
