var async = require('async');
var assert = require('chai').assert;
var should = require('chai').should();
var blueprint = require('@onehilltech/blueprint');
var appPath = require('../../../fixtures/appPath');
var it = require("mocha").it;
var before = require("mocha").before;
var describe = require("mocha").describe;
var users = require('../../../fixtures/users');
var after = require("mocha").after;

describe('Users API v1', function () {
    var server;
    var request;

    function createUser(key, done) {
        request
            .post('/api/v1/users')
            .type('json')
            .set('Accept', 'application/json')
            .send(users[key])
            .expect(201)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                var body = response.body;
                assert(response.body._id);
                assert(!response.body.password);
                assert(!response.body.__v);
                users[key] = body;
                done();
            });
    }

    function getUser(key, param, done) {
        request
            .get('/api/v1/users/' + users[key][param])
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                //noinspection JSUnresolvedVariable
                response.body.should.deep.equal(users[key]);
                done();
            })
    }

    function deleteUser(key, param, done) {
        request
            .delete('/api/v1/users/' + users[key][param])
            .expect(204, done);
    }

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

    it('should create a single user', function(done) {
        createUser(0, done);
    });

    it('should create a second user', function(done) {
        createUser(1, done);
    });

    it('should create a third user', function(done) {
        createUser(2, done);
    });

    it('should create a forth user', function(done) {
        createUser(3, done);
    });

    it('should not re-create the same user', function(done) {
        request
            .post('/api/v1/users')
            .type('json')
            .set('Accept', 'application/json')
            .send(users[0])
            .expect(409)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                assert(response.body.errors[0].status == 409);
                assert(response.body.errors[0].title == "Conflict");
                assert(response.body.errors[0].message == "Already exists");

                done();
            });
    });

    it('should get created user by `_id`', function(done) {
        getUser(0, '_id', done);
    });

    it('should get created user by `handle`', function(done) {
        getUser(0, 'handle', done);
    });

    it('should change `emailAddress` of created user', function(done) {
        request
            .put('/api/v1/users/' + users[0]._id)
            .type('json')
            .send({
                "emailAddress": "bdfoster@iupui.edu"
            })
            .expect(200)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                assert(response.body.emailAddress == "bdfoster@iupui.edu");
                assert(response.body.updatedAt != users[0].updatedAt);
                assert(response.body.createdAt == users[0].createdAt);
                response.body._id.should.equal(users[0]._id);
                users[0] = response.body;
                done();
            })
    });

    it('should not accept invalid \'emailAddress\' on updating user', function(done) {
        request
            .put('/api/v1/users/' + users[0]._id)
            .type('json')
            .send({
                "emailAddress": "test1234example.org"
            })
            .expect(409)
            .end(function(error, response) {
                if (error) {
                    return done(error);
                }

                assert(response.body.errors[0].status == 409);
                assert(response.body.errors[0].title == "Conflict");
                assert(response.body.errors[0].paths.emailAddress.message);

                done();
            });
    });

    it('should delete first created user by `_id', function(done) {
        deleteUser(0, '_id', done);
    });

    it('should delete second created user by `handle`', function(done) {
        deleteUser(1, 'handle', done);
    });

    it('should delete third created user', function(done) {
        deleteUser(2, '_id', done);
    });

    it('should delete forth created user', function(done) {
        deleteUser(3, '_id', done);
    });

    it('should not be able to GET deleted user by `_id`', function(done) {
        request
            .get('/api/v1/users/' + users[0]._id)
            .expect(404, done);
    });
});
