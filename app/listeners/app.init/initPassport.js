'use strict';

/**
 * initPassport.js
 *
 * This file initializes the different authentication strategies for Passport.js
 * support by your application.
 *
 * Blueprint.js does not install any authentication strategies by default. You will
 * need to first use npm to install the authentication strategy. Then, you can load
 * it into Passport.js here.
 */

var passport      = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , JwtStrategy   = require('passport-jwt').Strategy
  , ExtractJwt    = require('passport-jwt').ExtractJwt
  , winston       = require('winston')
  , mongoose      = require('mongoose')
  ;

module.exports = initPassport;

function initPassport (app) {
    var User = app.models.User;
    var localOptions = {
        usernameField: 'handle',
        session: false
    };

    var jwtOptions = {
        jwtFromRequest: ExtractJwt.fromBodyField('auth_token'),
        secretOrKey: 'mysecret'
    };

    function localAuthorize(handle, password, done) {
        User.findOne({ handle: handle }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    };

    function jwtAuthorize(payload, done) {
        User.findById(payload, function (err, user) {
            if (err) { return done(err, false); }
            if (user) { done(null, user); }
            else { done(null, false); }
        });
    };

    passport.use(new LocalStrategy(localOptions, localAuthorize));
    passport.use(new JwtStrategy(jwtOptions, jwtAuthorize));
}
