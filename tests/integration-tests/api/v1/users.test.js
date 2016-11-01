var async = require('async');
var assert = require('chai').assert;
var should = require('chai').should();
var blueprint = require('@onehilltech/blueprint');
var appPath = require('../../../fixtures/appPath');
var it = require("mocha").it;
var before = require("mocha").before;
var describe = require("mocha").describe;
var users = require('../../../fixtures/users');

describe('Route: /api/v1/users', function () {
    var server;
    var request;

    var user = users[0];

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

    it('should create a user', function(done) {
        request
            .post('/api/v1/users')
            .type('json')
            .set('Accept', 'application/json')
            .send(user)
            .expect(201)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                var body = response.body;
                assert(response.body._id);
                user = body;
                done();
            });
    });

    it('should not re-create the same user', function(done) {
        request
            .post('/api/v1/users')
            .type('json')
            .set('Accept', 'application/json')
            .send(user)
            .expect(409)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                done();
            });
    });

    it('should get created user', function(done) {
        request
            .get('/api/v1/users/' + user._id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                //noinspection JSUnresolvedVariable
                response.body.should.deep.equal(user);
                done();
            })
    });

    it('should change \'emailAddress\' field of created user', function(done) {
        request
            .put('/api/v1/users/' + user._id)
            .type('json')
            .send({
                "user": {
                    "emailAddress": "bdfoster@iupui.edu"
                }
            })
            .expect(200)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                response.body.emailAddress.should.equal("bdfoster@iupui.edu");
                response.body.updatedAt.should.not.equal(user.updatedAt);
                response.body.createdAt.should.equal(user.createdAt);
                user = response.body.user;
                done();
            })
    });

    it('should delete created user via DELETE: /api/v1/users/:id', function(done) {
        request
            .delete('/api/v1/users/' + user.id)
            .expect(204, done);
    });


});
