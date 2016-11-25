var blueprint = require("@onehilltech/blueprint");
var ResourceController = require("./../../lib/ResourceController");
var Channel = require("../models/Channel");
var passport = require("passport");

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
