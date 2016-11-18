var blueprint = require("@onehilltech/blueprint");
var ResourceController = require("./../../lib/ResourceController");
var Org = require("../models/Org");

function OrgController () {
  ResourceController.call(this, {
    model: Org
  });
}

blueprint.controller(OrgController, ResourceController);

module.exports = OrgController;
