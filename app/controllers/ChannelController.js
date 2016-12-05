const blueprint = require("@onehilltech/blueprint");
const ResourceController = require("./../../lib/ResourceController");
const Channel = require("../models/Channel");
const passport = require("passport");
var mongoose = require("mongoose");

function ChannelController () {
  // noinspection JSUnresolvedFunction
  ResourceController.call(this, {
    model: Channel,
    authorize: {
      any: [
        passport.authenticate("jwt", {session: false})
      ]
    },
    normalize: {
      getAll: [function (req, res, next) {
        if (req.query.members) {
          if (req.query.members instanceof Array) {
            for (let member of req.query.members) {
              member = mongoose.Types.ObjectId(member);
            }
          } else {
            req.query.members = mongoose.Types.ObjectId(req.query.members);
          }
        }
        next();
      }],
      get: [function (req, res, next) {
        if (req.query.members) {
          if (req.query.members instanceof Array) {
            for (let member of req.query.members) {
              member = mongoose.Types.ObjectId(member);
            }
          } else {
            req.query.members = mongoose.Types.ObjectId(req.query.members);
          }
        }
        next();
      }]
    }
  });
}

blueprint.controller(ChannelController, ResourceController);

module.exports = ChannelController;
