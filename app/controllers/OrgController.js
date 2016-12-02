const blueprint = require("@onehilltech/blueprint");
const ResourceController = require("./../../lib/ResourceController");
const Org = require("../models/Org");
const passport = require("passport");

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
