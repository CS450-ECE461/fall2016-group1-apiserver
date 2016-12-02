const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = initPassport;

function initPassport (app) {
  const User = app.models.User;
  const localOptions = {session: false};

  const jwtOptions = {
    // jwtFromRequest: ExtractJwt.fromBodyField("jwt"),
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: "mysecret"
  };

  function localAuthorize (username, password, done) {
    const criteria = {$or: [{handle: username}, {emailAddress: username}]};
    User.findOne(criteria, function (err, user) {
      /* istanbul ignore if  */
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      user.verifyPassword(password, function (error, isMatch) {
        if (error) { return done(error); }
        if (!isMatch) { return done(null, false); }
        return done(null, user);
      });
    });
  }

  function jwtAuthorize (payload, done) {
    User.findById(payload, function (err, user) {
      /* istanbul ignore if  */
      if (err) { return done(err, false); }
      if (!user) { return done(null, false); }
      done(null, user);
    });
  }

  passport.use(new LocalStrategy(localOptions, localAuthorize));
  passport.use(new JwtStrategy(jwtOptions, jwtAuthorize));
}
