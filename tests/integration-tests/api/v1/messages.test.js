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

describe("Message API v1", function () {
  var server;
  var agent;
  var userClient;
  var messageClient;
  var users = require("../../../fixtures/users");
  var messages = require("../../../fixtures/messages");

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
        messageClient = new ResourceClient(agent, "messages", 1);
        return callback(null);
      }
    ], done);
  });

  before(function (done) {
    this.timeout(5000);
    // Create a User via API
    async.waterfall([
      function (callback) {
        var count = 0;
        for (let user of users) {
          userClient.create(user).expect(201).end(function (error, response) {
            if (error) { return callback(error); }
            assert(response.status === 201);
            user["_id"] = response.body.user._id;
            if (++count >= users.length) { return callback(null); }
          });
        }
      }
    ], done);
  });

  it("should not send a message without authentication", function (done) {
    messageClient.create(messages[0])
      .end(function (error, response) {
        if (error) { return done(error); };
        assert(response.status === 401);
        done();
      });
  });

   // it("should create a message from an authenticated user to another user", function (done) {
   // messageClient.auth(users[0].emailAddress, user[0].password, function (error, jwt) {
   //   if (error) {
   //     return done(error);
   //   }
   //   assert(jwt === messageClient.jwt);

   //   messageClient.create(messages[0]).expect(201).end(function (error, response) {
   //     if (error) {
   //       return done(error);
   //     }

   //     _.each(messages[0], function (prop) {
   //       assert(messages[0][prop] === response.body.messages[prop]);
   //     });
   //     messages[0]._id = response.body.messages._id;
   //     done();
   //   });
   // });
   // });

  // it("should update a created org by an org admin", function (done) {
  //  var emailAddress = "admin@test1.org";
  //  orgClient.update(orgs[0], { "emailAddress": emailAddress }, function (error, response) {
  //    if (error) {
  //      return done(error);
  //    }
  //    response.body.org.emailAddress.should.equal(emailAddress);
  //    orgs[0].emailAddress = emailAddress;
  //    done();
  //  });
  // });

  // it("should not update a created org without an authenticated user", function (done) {
  //  var emailAddress = "admin2@test1.org";
  //  orgClient.deauth();
  //  orgClient.update(orgs[0]._id, {
  //    org: {
  //      "emailAddress": emailAddress
  //    }
  //  }).expect(401, done);
  // });

  after(function (done) {
    async.waterfall([
      function (callback) {
        var count = 0;
        for (let user of users) {
          userClient.delete(user._id).expect(204).end(function (error) {
            if (error) {
              return callback(error);
            }
            if (++count >= users.length) { return callback(null); }
          });
        }
      }
    ], done);
  });
});
