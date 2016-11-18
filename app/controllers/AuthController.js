var blueprint = require("@onehilltech/blueprint");
var passport = require("passport");
var errors = require("../../lib/errors");

function AuthController() {
    blueprint.BaseController.call(this);
}

blueprint.controller(AuthController);

//noinspection JSUnusedGlobalSymbols
AuthController.prototype.login = function () {
    return function (req, res, next) {
        passport.authenticate("local", {
            session: false
        }, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new errors.InvalidCredentialsError());
            }
            return res.json({jwt: user.createToken()});
        })(req, res, next);
    };
};

module.exports = AuthController;
