var async = require('async');
var should = require('chai').should();
var blueprint = require('@onehilltech/blueprint');
var appPath = require('../../../fixtures/appPath');
var it = require("mocha").it;
var before = require("mocha").before;
var describe = require("mocha").describe;
var users = require('../../../fixtures/users.json');

describe('API v1', function () {
    var server;
    var request;
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

    describe('POST: /api/v1/users', function() {
        it('should create a user', function(done) {
            var body = {
                user: {
                    _id: "bdfoster",
                    firstName: "Brian",
                    lastName: "Foster",
                    emailAddress: "bdfoster89@gmail.com",
                    password: "test123!"
                }
            };

            request
                .post('/api/v1/users')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(JSON.stringify(body))
                .expect(200)
                .expect('Content-Type', 'application/json')
                .end(function(error, request) {
                    if (error) {
                        return done(error);
                    }
                }, done);
        });
    });

    describe('GET: /api/v1/users', function () {
        it('should return HTTP status code 404 unconditionally', function (done) {
            request
                .get('/api/v1/users')
                .expect(404, done);
        });
    });
});
