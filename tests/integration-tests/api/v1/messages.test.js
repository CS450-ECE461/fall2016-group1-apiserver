const async = require("async");
const assert = require("chai").assert;
const blueprint = require("@onehilltech/blueprint");
let should = require("chai").should();
const expect = require("chai").expect;
const appPath = require("../../../fixtures/appPath");
const after = require("mocha").after;
const it = require("mocha").it;
const before = require("mocha").before;
const describe = require("mocha").describe;
const ResourceClient = require("../../../../lib/ResourceClient");
const _ = require("lodash");
const Channel = require("../../../../app/models/Channel");
const Message = require("../../../../app/models/Message");
const User = require("../../../../app/models/User");

describe("Message API v1", function () {
  let server;
  let agent;
  let userClient;
  let messageClient;
  const users = require("../../../fixtures/users");
  const messages = require("../../../fixtures/messages");

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
        let count = 0;
        for (let user of users) {
          userClient.create(user).expect(201).end(function (error, response) {
            if (error) {
              return callback(error);
            }
            assert(response.status === 201);
            user["_id"] = response.body.user._id;
            if (++count >= users.length) {
              return callback(null);
            }
          });
        }
      }
    ], done);
  });

  it("should not send a message without an authenticated user", function (done) {
    messageClient.create(messages[0])
      .end(function (error, response) {
        if (error) {
          return done(error);
        }
        assert(response.status === 401);
        done();
      });
  });

  it("should create a message with an authenticated user, using `receivers` field", function (done) {
    messageClient.auth(users[0].emailAddress, users[0].password, function (error, jwt) {
      if (error) {
        return done(error);
      }

      assert(jwt === messageClient.jwt);
      messages[0].channel = {receivers: [users[1]._id]};
      messages[0].sender = users[0]._id;

      messageClient.create(messages[0]).expect(201).end(function (error, response) {
        if (error) {
          return done(error);
        }

        _.each(messages[0], function (prop) {
          assert(messages[0][prop] === response.body.message[prop]);
        });
        messages[0]._id = response.body.message._id;
        assert(response.body.message.channel !== undefined);
        messages[0].channel = response.body.message.channel;
        messageClient.deauth();
        done();
      });
    });
  });

  it("should create a message with an authenticated user, using existing channel", function (done) {
    messageClient.auth(users[1].emailAddress, users[1].password, function (error, jwt) {
      if (error) {
        return done(error);
      }

      assert(jwt === messageClient.jwt);
      messages[1].channel = messages[0].channel;
      messages[1].sender = users[1]._id;

      messageClient.create(messages[1]).expect(201).end(function (error, response) {
        if (error) {
          return done(error);
        }

        _.each(messages[1], function (prop) {
          assert(messages[1][prop] === response.body.message[prop]);
        });
        messages[1]._id = response.body.message._id;
        messages[1].channel = response.body.message.channel;
        assert(messages[1].channel === messages[0].channel);

        messageClient.deauth();
        done();
      });
    });
  });

  it("should create a message with an authenticated user, using `receiver` field and existing channel", function (done) {
    messageClient.auth(users[0].emailAddress, users[0].password, function (error, jwt) {
      if (error) {
        return done(error);
      }

      assert(jwt === messageClient.jwt);
      messages[2].channel = {receiver: users[1]._id};
      messages[2].sender = users[0]._id;

      messageClient.create(messages[2]).expect(201).end(function (error, response) {
        if (error) {
          return done(error);
        }

        _.each(messages[2], function (prop) {
          assert(messages[2][prop] === response.body.message[prop]);
        });
        messages[2]._id = response.body.message._id;
        messages[2].channel = response.body.message.channel;

        assert(messages[2].channel === messages[1].channel);

        messageClient.deauth();
        done();
      });
    });
  });

  it("should create another message with an authenticated user, using `receiver` and new channel", function (done) {
    messageClient.auth(users[2].emailAddress, users[2].password, function (error, jwt) {
      if (error) {
        return done(error);
      }

      assert(jwt === messageClient.jwt);
      messages[3].channel = {receiver: users[3]._id};
      messages[3].sender = users[2]._id;

      messageClient.create(messages[3]).expect(201).end(function (error, response) {
        if (error) {
          return done(error);
        }

        _.each(messages[3], function (prop) {
          assert(messages[3][prop] === response.body.message[prop]);
        });
        messages[3]._id = response.body.message._id;
        messages[3].channel = response.body.message.channel;

        // Should not use existing channel (i.e. the one for messages between users[0] and users[1])
        assert(messages[3].channel !== messages[2].channel);

        messageClient.deauth();
        done();
      });
    });
  });

  it("should retreive message with an authenticated user", function (done) {
    messageClient.auth(users[2].emailAddress, users[2].password, function (error, jwt) {
      if (error) {
        return done(error);
      }

      messageClient.get(messages[3]._id).expect(200).end(function (error, response) {
        if (error) {
          return done(error);
        }

        _.each(messages[3], function (prop) {
          assert(messages[3][prop] === response.body.message[prop]);
        });
        messages[3]._id = response.body.message._id;
        messages[3].channel = response.body.message.channel;

        // Should be the correct channel
        assert(messages[3].channel === response.body.message.channel);
        assert(response.body.message.channel !== messages[2].channel);

        messageClient.deauth();
        done();
      });
    });
  });

  it.skip("should retreive all messages for an authenticated user", function (done) {
    messageClient.auth(users[2].emailAddress, users[2].password, function (error) {
      if (error) {
        return done(error);
      }

      messageClient.get().expect(200).end(function (error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.messages.length).to.equal(1);
        expect(response.body.messages[0]._id).to.equal(messages[3]._id);

        console.log(response.body);

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
