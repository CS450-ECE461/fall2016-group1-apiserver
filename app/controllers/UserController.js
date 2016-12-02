const blueprint = require("@onehilltech/blueprint");
const ResourceController = require("./../../lib/ResourceController");
const User = require("../models/User");

function UserController () {
  ResourceController.call(this, {
    model: User,
    uniques: ["_id", "handle", "emailAddress"]
  });
}

blueprint.controller(UserController, ResourceController);

// noinspection JSUnusedGlobalSymbols
UserController.prototype.showMe = function () {
  return function (req, res) {
    res.json(req.user.toJSON());
  };
};

module.exports = UserController;
