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

  it("should create a message from an authenticated user to another user, using receivers", function (done) {
    messageClient.auth(users[0].emailAddress, users[0].password, function (error, jwt) {
      if (error) { return done(error); }

      assert(jwt === messageClient.jwt);
      messages[0].receivers = [users[1]._id];
      messages[0].sender = users[0]._id;

      messageClient.create(messages[0]).expect(201).end(function (error, response) {
        if (error) { return done(error); }

        _.each(messages[0], function (prop) {
          assert(messages[0][prop] === response.body.message[prop]);
        });
        messages[0]._id = response.body.message._id;
        messages[0].channel = response.body.message.channel;
        messageClient.deauth();
        done();
      });
    });
  });

  it("should create a message from an authenticated user to another user, using channel", function (done) {
    messageClient.auth(users[1].emailAddress, users[1].password, function (error, jwt) {
      if (error) { return done(error); }

      assert(jwt === messageClient.jwt);
      messages[1].channel = messages[0].channel;

      messageClient.create(messages[1]).expect(201).end(function (error, response) {
        if (error) { return done(error); }

        _.each(messages[1], function (prop) {
          assert(messages[1][prop] === response.body.message[prop]);
        });
        messages[1]._id = response.body.message._id;
        messageClient.deauth();
        done();
      });
    });
  });

  it("should create another message using receiver", function (done) {
    messageClient.auth(users[0].emailAddress, users[0].password, function (error, jwt) {
      if (error) { return done(error); }

      assert(jwt === messageClient.jwt);
      messages[2].receiver = users[1]._id;

      messageClient.create(messages[2]).expect(201).end(function (error, response) {
        if (error) { return done(error); }

        _.each(messages[2], function (prop) {
          assert(messages[2][prop] === response.body.message[prop]);
        });
        messages[2]._id = response.body.message._id;
        messageClient.deauth();
        done();
      });
    });
  });

  it("should create another message using receiver", function (done) {
    messageClient.auth(users[2].emailAddress, users[2].password, function (error, jwt) {
      if (error) { return done(error); }

      assert(jwt === messageClient.jwt);
      messages[3].receiver = users[3]._id;

      messageClient.create(messages[3]).expect(201).end(function (error, response) {
        if (error) { return done(error); }

        _.each(messages[3], function (prop) {
          assert(messages[3][prop] === response.body.message[prop]);
        });
        messages[3]._id = response.body.message._id;
        messageClient.deauth();
        done();
      });
    });
  });

  after(function (done) {
    async.waterfall([
      function (callback) {
        messageClient.auth(users[0].emailAddress, users[0].password, function (error, jwt) {
          if (error) {
            return callback(error);
          }
          var count = 0;
          for (let message of messages) {
            if (!message._id) { ++count; } else {
              messageClient.delete(message._id).expect(204).end(function (error) {
                if (error) {
                  return callback(error);
                }
                if (++count >= messages.length) { return callback(null); }
              });
            }
          }
        });
      },
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
