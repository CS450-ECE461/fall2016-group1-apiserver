var blueprint = require('@onehilltech/blueprint')
  , passport  = require('passport')
  ;

function LoginController () {
  blueprint.BaseController.call (this);
}

blueprint.controller (LoginController);

LoginController.prototype.login = function () {
    return function (req, res, next) {
        passport.authenticate('local', {
            failureRedirect: '/login',
            session: false
        }, function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            return res.json({ token: user.createToken() });
        })(req, res, next);
  };
};

LoginController.prototype.logout = function () {
  return function (req, res) {
    req.logout ();
    res.redirect ('/login');
  }
};

module.exports = LoginController;
