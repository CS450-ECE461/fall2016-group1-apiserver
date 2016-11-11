var async = require('async');
var assert = require('chai').assert;
var should = require('chai').should();
var blueprint = require('@onehilltech/blueprint');
var appPath = require('../../../fixtures/appPath');
var it = require("mocha").it;
var before = require("mocha").before;
var describe = require("mocha").describe;
var users = require('../../../fixtures/users');
var ResourceClient = require('../../../../lib/ResourceClient');


describe('Org API v1', function () {
    var server;
    var agent;
    var orgClient;
    var userClient;
    var admin = require('../../../fixtures/users')[0];
    var user = require('../../../fixtures/users')[1];
    var jwt;

    before(function (done) {
        async.waterfall([
            function (callback) {
                // `app` is returned with callback
                blueprint.testing.createApplicationAndStart(appPath, callback);
            },

            function (app, callback) {
                server = app.server;
                agent = require('supertest')(server.app);
                orgClient = new ResourceClient(agent, "orgs", 1);
                userClient = new ResourceClient(agent, "users", 1);
                return callback(null);
            }
        ], done);
    });

    before(function(done) {
        async.waterfall([
            function(callback) {
                userClient.create(admin).end(function(error, response) {
                    if (error) {
                        return callback(error);
                    }
                    console.log(response.body);
                    admin['_id'] = response.body.user._id;
                    return callback(null);
                })
            },
            function(callback) {
                userClient.create(user).end(function(error, response) {
                    if (error) {
                        return callback(error);
                    }

                    user['_id'] = response.body.user._id;
                    return callback(null);
                })
            }
        ], done);
    });

    it('should not allow creating a org without an authenticated user', function(done) {
        done();
    });

    it('should allow creating an org with an authenticated user', function(done) {
        done();
    });

    it('should allow updating a created org by an org admin', function(done) {
        done();
    });

    it('should allow adding users to an org by an org admin', function(done) {
        done();
    });

    after(function(done) {
        async.waterfall([
            function(callback) {
                userClient.delete(admin).end(function(error, response) {
                    if (error) {
                        return callback(error);
                    }
                    console.log(response.body);
                    response.status.should.equal(204);
                    return callback(null);
                })
            },
            function(callback) {
                userClient.delete(user).end(function(error, response) {
                    if (error) {
                        return callback(error);
                    }
                    response.status.should.equal(204);
                    return callback(null);
                })
            }
        ], done);
    })


});