const async = require("async");
const assert = require("chai").assert;
const blueprint = require("@onehilltech/blueprint");
let should = require("chai").should();
const appPath = require("../../../fixtures/appPath");
const after = require("mocha").after;
const it = require("mocha").it;
const before = require("mocha").before;
const describe = require("mocha").describe;
const ResourceClient = require("../../../../lib/ResourceClient");
const _ = require("lodash");

describe("Org API v1", function () {
  let server;
  let agent;
  let userClient;
  let orgClient;
  const admin = require("../../../fixtures/users")[0];
  const user = require("../../../fixtures/users")[1];
  const orgs = require("../../../fixtures/orgs");

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
    const emailAddress = "admin@test1.org";
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
    const emailAddress = "admin2@test1.org";
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
        userClient.auth(admin.emailAddress, admin.password, function(error) {
          if (error) {
            return done(error);
          }
        
          userClient.delete(admin._id).expect(204).end(function (error) {
            if (error) {
              return callback(error);
            }
            userClient.deauth()
            return callback(null);
          });
        });
      },
      function (callback) {
         userClient.auth(user.emailAddress, user.password, function(error) {
          if (error) {
            return done(error);
          }
        
          userClient.delete(user._id).expect(204).end(function (error) {
            if (error) {
              return callback(error);
            }
            userClient.deauth()
            return callback(null);
          });
        });
      }
    ], done);
  });
});
