const blueprint = require("@onehilltech/blueprint");
const ResourceController = require("./../../lib/ResourceController");
const Channel = require("../models/Channel");
const passport = require("passport");

function ChannelController () {
  // noinspection JSUnresolvedFunction
  ResourceController.call(this, {
    model: Channel,
    authorize: {
      any: [
        passport.authenticate("jwt", {session: false})
      ]
    }
  });
}

blueprint.controller(ChannelController, ResourceController);

module.exports = ChannelController;
