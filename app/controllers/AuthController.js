var blueprint = require('@onehilltech/blueprint')
  , passport  = require('passport')
  ;

function AuthController () {
  blueprint.BaseController.call (this);
}

blueprint.controller (AuthController);

AuthController.prototype.login = function () {
    return function (req, res, next) {
        passport.authenticate('local', {
            session: false
        }, function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                return res.status(422).json({ error: 'Authentication Error.' });
            }
            return res.json({ auth_token: user.createToken() });
        })(req, res, next);
  };
};

module.exports = AuthController;
