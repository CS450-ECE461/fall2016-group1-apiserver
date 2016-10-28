var async = require('async');
var assert = require('chai').assert;
var should = require('chai').should();
var blueprint = require('@onehilltech/blueprint');
var appPath = require('../../../fixtures/appPath');
var it = require("mocha").it;
var before = require("mocha").before;
var describe = require("mocha").describe;
var users = require('../../../fixtures/users.json');

describe('Route: /api/v1/users', function () {
    var server;
    var request;

    var user = {
        "handle": "bdfoster",
        "firstName": "Brian",
        "lastName": "Foster",
        "emailAddress": "bdfoster89@gmail.com",
        "password": "test123"
    };

    before(function (done) {
        async.waterfall([
            function(callback) {
                blueprint.testing.createApplicationAndStart(appPath, callback)
            },

            function(app, callback) {
                server = app.server;
                request = require('supertest')(server.app);
                return callback(null);
            }
        ], done);
    });

    it('should create a user via POST: /api/v1/users', function(done) {
        request
            .post('/api/v1/users')
            .type('json')
            .set('Accept', 'application/json')
            .send({
                "user": user
            })
            .expect(200)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                var body = response.body;
                response.status.should.equal(200);
                assert(response.body.user._id);
                user = body.user;
                done();
            });
    });

    it('should get created user via GET: /api/v1/users/:id', function(done) {
        request
            .get('/api/v1/users/' + user._id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                //noinspection JSUnresolvedVariable
                response.body.user.should.deep.equal(user);
                done();
            })
    });

    it('should change \'emailAddress\' field of created user via PUT: /api/v1/users/:id', function(done) {
        request
            .put('/api/v1/users/' + user._id)
            .type('json')
            .send({
                "user": {
                    "emailAddress": "fosterbd@iupui.edu"
                }
            })
            .expect(200)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                response.body.user.emailAddress.should.equal("fosterbd@iupui.edu");
                response.body.user.updatedAt.should.not.equal(user.updatedAt);
                response.body.user.createdAt.should.equal(user.createdAt);
                user = response.body.user;
                done();
            })
    });

    it('should delete created user via DELETE: /api/v1/users/:id', function(done) {
        request
            .delete('/api/v1/users/' + user._id)
            .expect(200, done);
    });


});
