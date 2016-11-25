var async = require("async");
var assert = require("chai").assert;
var blueprint = require("@onehilltech/blueprint");
var should = require("chai").should();
var expect = require("chai").expect;
var appPath = require("../../../fixtures/appPath");
var after = require("mocha").after;
var it = require("mocha").it;
var before = require("mocha").before;
var describe = require("mocha").describe;
var ResourceClient = require("../../../../lib/ResourceClient");
var _ = require("lodash");
var Channel = require("../../../../app/models/Channel");
var Message = require("../../../../app/models/Message");
var User = require("../../../../app/models/User");

describe("Channel API v1", function () {
  var server;
  var agent;
  var userClient;
  var messageClient;
  var channelClient;
  var users = require("../../../fixtures/users");
  var messages = require("../../../fixtures/messages");
  var channels;

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
        channelClient = new ResourceClient(agent, "channels", 1);
        return callback(null);
      }
    ], done);
  });

  before(function (done) {
    this.timeout(5000);
    // Create users via User API
    async.waterfall([
      function (callback) {
        var count = 0;
        for (let user of users) {
          userClient.create(user).expect(201).end(function (error, response) {
            if (error) { return callback(error); }
            assert(response.status === 201);
            user["_id"] = response.body.user._id;
            if (++count >= users.length) {
              channels = require("../../../fixtures/channels");
              return callback(null);
            }
          });
        }
      }
    ], done);
  });

  it("should not create a channel without an authenticated user", function (done) {
    channelClient.create(channels[0]).expect(401, done);
  });

  it("should create a channel with an authenticated user", function (done) {
    channelClient.auth(users[0].handle, users[0].password, function (error) {
      if (error) {
        return done(error);
      }

      channelClient.create(channels[0]).expect(201).end(function (error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.channel.members).to.deep.equal(channels[0].members);
        channels[0]._id = response.body.channel._id;
        channelClient.deauth();
        done();
      });
    });
  });

  it("should create a message with an authenticated user on an existing channel", function (done) {
    messageClient.auth(users[0].handle, users[0].password, function (error) {
      if (error) {
        return done(error);
      }

      messages[0].channel = channels[0]._id;

      messageClient.create(messages[0]).expect(201).end(function (error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.message.channel).to.equal(channels[0]._id);
        messageClient.deauth();
        done();
      });
    });
  });

  after(function (done) {
    this.timeout(5000);
    Channel.remove({}, function (error) {
      if (error) {
        return done(error);
      }
      Message.remove({}, function (error) {
        if (error) {
          return done(error);
        }
        User.remove({}, function (error) {
          if (error) {
            return done(error);
          }
          return done();
        });
      });
    });
  });
});
