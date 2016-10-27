var expect = require('chai').expect;
var should = require('chai').should();
var blueprint = require('@onehilltech/blueprint');
var testing = blueprint.testing;
var appPath = require('../../../fixtures/appPath');
var it = require("mocha").it;
var before = require("mocha").before;
var describe = require("mocha").describe;
var users = require('../../../fixtures/users.json');

describe('API v1', function () {
    var request;
    before(function (done) {
        testing.createApplicationAndStart(appPath, function () {
            request = require('supertest')(blueprint.app.server.app);
            done();
        });
    });

    describe('POST: /api/v1/users', function() {
        it('should create a user', function(done) {
            request
                .post('/api/v1/users')
                .send(users[0])
                .expect(200, done);
        })
    });

    describe('GET: /api/v1/users', function () {
        it('should return HTTP status code 404 unconditionally', function (done) {
            request
                .get('/api/v1/users')
                .expect(404, done);
        });
    });
});
