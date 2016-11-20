var async = require("async");
var assert = require("chai").assert;
var blueprint = require("@onehilltech/blueprint");
var should = require("chai").should();
var appPath = require("../../../fixtures/appPath");
var after = require("mocha").after;
var it = require("mocha").it;
var before = require("mocha").before;
var describe = require("mocha").describe;
var ResourceClient = require("../../../../lib/ResourceClient");
var _ = require("lodash");

describe("Org API v1", function () {
  var server;
  var agent;
  var userClient;
  var orgClient;
  var admin = require("../../../fixtures/users")[0];
  var user = require("../../../fixtures/users")[1];
  var orgs = require("../../../fixtures/orgs");

  before(function (done) {
    this.timeout(5000);
    // Start server and create clients for User and Org
    async.waterfall([
      function (callback) {
        // `app` is returned with callback
        blueprint.testing.createApplicationAndStart(appPath, callback);
      },

      function (app, callback) {
        server = app.server;
        agent = require("supertest")(server.app);
        userClient = new ResourceClient(agent, "users", 1);
        orgClient = new ResourceClient(agent, "orgs", 1);
        return callback(null);
      }
    ], done);
  });

  before(function (done) {
    this.timeout(5000);
    // Create an Admin user and a regular User via API
    async.waterfall([
      function (callback) {
        userClient.create(admin).end(function (error, response) {
          if (error) {
            return callback(error);
          }

          admin["_id"] = response.body.user._id;
          return callback(null);
        });
      },
      function (callback) {
        userClient.create(user).expect(201).end(function (error, response) {
          if (error) {
            return callback(error);
          }
          assert(response.status === 201);
          user["_id"] = response.body.user._id;
          return callback(null);
        });
      }
    ], done);
  });

  it("should not create an org without an authenticated user", function (done) {
    orgClient.create({org: orgs[0]}).expect(401, done);
  });

  it("should create an org with an authenticated user", function (done) {
    orgClient.auth(admin.emailAddress, admin.password, function (error, jwt) {
      if (error) {
        return done(error);
      }
      assert(jwt === orgClient.jwt);

      orgClient.create(orgs[0]).expect(201).end(function (error, response) {
        if (error) {
          return done(error);
        }

        _.each(orgs[0], function (prop) {
          assert(orgs[0][prop] === response.body.org[prop]);
        });
        orgs[0]._id = response.body.org._id;
        done();
      });
    });
  });

  it("should update a created org by an org admin", function (done) {
    var emailAddress = "admin@test1.org";
    orgClient.update(orgs[0], { "emailAddress": emailAddress }, function (error, response) {
      if (error) {
        return done(error);
      }
      response.body.org.emailAddress.should.equal(emailAddress);
      orgs[0].emailAddress = emailAddress;
      done();
    });
  });

  it("should not update a created org without an authenticated user", function (done) {
    var emailAddress = "admin2@test1.org";
    orgClient.deauth();
    orgClient.update(orgs[0]._id, {
      org: {
        "emailAddress": emailAddress
      }
    }).expect(401, done);
  });

  after(function (done) {
    async.waterfall([
      function (callback) {
        userClient.delete(admin._id).expect(204).end(function (error) {
          if (error) {
            return callback(error);
          }
          return callback(null);
        });
      },
      function (callback) {
        userClient.delete(user._id).expect(204).end(function (error) {
          if (error) {
            return callback(error);
          }
          return callback(null);
        });
      }
    ], done);
  });
});
