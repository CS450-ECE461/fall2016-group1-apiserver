var blueprint = require("@onehilltech/blueprint");
var ResourceController = require("./../../lib/ResourceController");
var Org = require("../models/Org");
var passport = require("passport");

function OrgController () {
  // noinspection JSUnresolvedFunction
  ResourceController.call(this, {
    model: Org,
    authorize: {
      create: [
        passport.authenticate("jwt", {session: false})
      ],
      update: [
        passport.authenticate("jwt", {session: false})
      ]
    }
  });
}

blueprint.controller(OrgController, ResourceController);

module.exports = OrgController;
