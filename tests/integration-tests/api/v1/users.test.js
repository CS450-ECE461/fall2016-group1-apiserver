const async = require("async");
const assert = require("chai").assert;
let should = require("chai").should();
const blueprint = require("@onehilltech/blueprint");
const appPath = require("../../../fixtures/appPath");
const it = require("mocha").it;
const before = require("mocha").before;
const describe = require("mocha").describe;
const users = require("../../../fixtures/users");
const ResourceClient = require("../../../../lib/ResourceClient");
const _ = require("lodash");

describe("User API v1", function () {
  let server;
  let agent;
  let client;

  function createOne (index, done) {
    client
      .create(users[index])
      .expect(201)
      .end(function (error, response) {
        if (error) {
          return done(error);
        }

        const body = response.body;
        assert(response.body.user._id);
        assert(!response.body.user.password);
        assert(!response.body.user.__v);
        const passwd = users[index].password;
        users[index] = body.user;
        users[index].password = passwd;
        done();
      });
  }

  function getOne (index, field, done) {
    client
      .get(users[index][field])
      .expect(200)
      .end(function (error, response) {
        if (error) {
          return done(error);
        }

        // noinspection JSUnresolvedVariable
        response.body.user.should.deep.equal(_.omit(users[index], ["password"]));
        done();
      });
  }

  function updateOne (index, key, value, done) {
    const doc = {};
    doc[key] = value;

    client.auth(users[index].emailAddress, users[index].password, function(error) {
      if (error) {
        return done(error);
      }
          
      client
        .update(users[index]._id, doc)
        .expect(200)
        .end(function (error, response) {
          if (error) {
            return done(error);
          }

          // noinspection JSUnresolvedVariable
          response.body.user._id.should.equal(users[index]._id);
          response.body.user[key].should.equal(value);
          response.body.user.updatedAt.should.not.equal(users[index].updatedAt);
          response.body.user.createdAt.should.equal(users[index].createdAt);
          const passwd = users[index].password;
          users[index] = response.body.user;
          users[index].password = passwd;
          client.deauth();
          done();
        });
    });
  }

  function deleteOne (index, field, done) {
    client.auth(users[index].emailAddress, users[index].password, function(error) {
      if (error) {
        return done(error);
      }
      
      client
        .delete(users[index][field])
        .expect(204)
        .end(function (error) {
          if (error) {
            return done(error);
          }
        
          client.deauth();
          done();
        });
    });
  }

  before(function (done) {
    this.timeout(5000);
    async.waterfall([
      function (callback) {
        return blueprint.testing.createApplicationAndStart(appPath, callback);
      },

      function (app, callback) {
        server = app.server;
        agent = require("supertest")(server.app);
        client = new ResourceClient(agent, "users", 1);

        return callback(null);
      }
    ], done);
  });

  it("should create a single user", function (done) {
    createOne(0, done);
  });

  it("should create a second user", function (done) {
    createOne(1, done);
  });

  it("should create a third user", function (done) {
    createOne(2, done);
  });

  it("should create a forth user", function (done) {
    createOne(3, done);
  });

  it("should not re-create the same user", function (done) {
    client
      .create(users[0])
      .expect(409)
      .end(function (error, response) {
        if (error) {
          return done(error);
        }

        assert(response.body.errors.length === 1);
        assert(response.body.errors[0].status === 409);
        assert(response.body.errors[0].name === "DuplicateError");

        done();
      });
  });

  it("should get created user by `_id`", function (done) {
    getOne(0, "_id", done);
  });

  it("should get created user by `handle`", function (done) {
    getOne(0, "handle", done);
  });

  it("should be able to search all users for one with a particular handle", function (done) {
    agent
      .get("/api/v1/users")
      .type("json")
      .query({handle: users[0].handle})
      .expect(200)
      .end(function (error, response) {
        if (error) {
          return done(error);
        }

        response.body.users.length.should.equal(1);
        response.body.users[0].handle.should.equal(users[0].handle);
        response.body.users[0]._id.should.equal(users[0]._id);
        done();
      });
  });

  it("should be able to search all users for one with a particular email address", function (done) {
    agent
      .get("/api/v1/users")
      .type("json")
      .query({emailAddress: users[0].emailAddress})
      .expect(200)
      .end(function (error, response) {
        if (error) {
          return done(error);
        }

        response.body.users.length.should.equal(1);
        response.body.users[0].emailAddress.should.equal(users[0].emailAddress);
        response.body.users[0]._id.should.equal(users[0]._id);
        done();
      });
  });

  it("should not be able to search all users for one with a particular password", function (done) {
    client
      .get()
      .query({password: users[0].password})
      .expect(200)
      .end(function (error, response) {
        if (error) {
          return done(error);
        }

        assert(response.body.users.length === 0);
        done();
      });
  });

  it("should be able to find all users", function (done) {
    agent
      .get("/api/v1/users")
      .type("json")
      .expect(200)
      .end(function (error, response) {
        if (error) {
          return done(error);
        }

        assert(response.body.users.length >= 4);

        let numFound = 0;
        for (let i = 0; i < response.body.users.length; i++) {
          for (let j = 0; j < users.length; j++) {
            if (users[j]._id === response.body.users[i]._id) {
              numFound++;
            }
          }
        }

        assert(numFound === users.length);
        done();
      });
  });

  it("should change `emailAddress` of created user", function (done) {
    updateOne(0, "emailAddress", "bdfoster@iupui.edu", done);
  });

  it("should get the updated user's new 'emailAddress'", function (done) {
    client
      .get(users[0]._id)
      .expect(200)
      .end(function (error, response) {
        if (error) { return done(error); }
        // noinspection JSUnresolvedVariable
        response.body.user.emailAddress.should.equal("bdfoster@iupui.edu");
        done();
      });
  });

  it("should delete first created user by `_id`", function (done) {
    deleteOne(0, "_id", done);
  });

  it("should delete second created user by `handle`", function (done) {
    deleteOne(1, "handle", done);
  });

  it("should delete third created user", function (done) {
    deleteOne(2, "_id", done);
  });

  it("should delete forth created user", function (done) {
    deleteOne(3, "_id", done);
  });

  it("should not be able to get a deleted user", function (done) {
    client
      .get(users[0])
      .expect(404)
      .end(function (error) {
        if (error) {
          return done(error);
        }

        return done();
      });
  });
});
