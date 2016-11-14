var passport = require("passport")
    , LocalStrategy = require("passport-local").Strategy
    , JwtStrategy = require("passport-jwt").Strategy
    , ExtractJwt = require("passport-jwt").ExtractJwt
    ;

module.exports = initPassport;

function initPassport(app) {
    var User = app.models.User;
    var localOptions = {session: false};

    var jwtOptions = {
        jwtFromRequest: ExtractJwt.fromBodyField("jwt"),
        secretOrKey: "mysecret"
    };

    function localAuthorize(username, password, done) {
        var criteria = {$or: [{handle: username}, {emailAddress: username}]};
        User.findOne(criteria, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!user.verifyPassword(password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }

    function jwtAuthorize(payload, done) {
        User.findById(payload, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            }
            else {
                done(null, false);
            }
        });
    }

    passport.use(new LocalStrategy(localOptions, localAuthorize));
    passport.use(new JwtStrategy(jwtOptions, jwtAuthorize));
}
