const blueprint = require("@onehilltech/blueprint");
const ResourceController = require("./../../lib/ResourceController");
const User = require("../models/User");
const passport = require("passport");
const errors = require("../../lib/errors");

function UserController () {
  ResourceController.call(this, {
    model: User,
    uniques: ["_id", "handle", "emailAddress"],
    authorize: {
      update: this.authorizeUserOnModify,
      delete: this.authorizeUserOnModify
    }
  });
}

blueprint.controller(UserController, ResourceController);

// noinspection JSUnusedGlobalSymbols
UserController.prototype.showMe = function () {
  return function (req, res) {
    res.json(req.user.toJSON());
  };
};
                          
UserController.prototype.authorizeUserOnModify = function() {
  return [
    passport.authenticate("jwt", { session: false }),
    function(request, response, next) {
      this.findOneByUnique(request.params.id, function(error, result) {
        if (error) {
          return next(errors.normalizeError(error));
        }

        if (result._id !== request.user._id) {
          return next(new errors.ForbiddenError());
        }
      });
    }
  ];
};
module.exports = UserController;
