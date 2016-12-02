const pluralize = require("pluralize");
const superagent = require("superagent");

function respond (request, callback) {
  if (callback) {
    return request.end(callback);
  } else {
    return request;
  }
}

function ResourceClient (agent, name, version) {
  let host = null;

  if (agent instanceof String) {
    host = agent;
    agent = superagent.agent();
  }

  this.agent = agent;
  this.name = name || null;

  /* istanbul ignore if */
  if (!this.name) {
    throw new Error("'name' param must be specified");
  }

  this.version = version || 1;

  if (!isNaN(this.version)) {
    this.version = "v" + this.version;
  }

  this.plural = pluralize.plural(this.name);
  this.singular = pluralize.singular(this.plural);
  this.basePath = "/api/" + this.version;

  if (this.host) {
    this.basePath = host + this.basePath;
  }

  this.path = this.basePath + "/" + this.plural;
  this.jwt = null;
}

ResourceClient.prototype.compilePath = function (identifier) {
  let path = this.path;

  if (identifier) {
    path += "/" + identifier;
  }

  return path;
};

ResourceClient.prototype.normalizeBody = function (data) {
  let body = {};
  if (data.hasOwnProperty(this.singular)) {
    body = data;
  } else {
    body[this.singular] = data;
  }

  return body;
};

ResourceClient.prototype.get = function (identifier, callback) {
  if (identifier && identifier._id) {
    identifier = identifier._id;
  }
  return respond(this.request("get", this.compilePath(identifier)), callback);
};

ResourceClient.prototype.post = function (callback) {
  return respond(this.request("post", this.compilePath()), callback);
};

ResourceClient.prototype.put = function (identifier, callback) {
  if (identifier && identifier._id) {
    identifier = identifier._id;
  }
  return respond(this.request("put", this.compilePath(identifier)), callback);
};
ResourceClient.prototype.delete = function (identifier, callback) {
  if (identifier && identifier._id) {
    identifier = identifier._id;
  }
  return respond(this.request("delete", this.compilePath(identifier)), callback);
};

ResourceClient.prototype.create = function (body, callback) {
  return respond(this.post().send(this.normalizeBody(body)), callback);
};

ResourceClient.prototype.update = function (identifier, body, callback) {
  return respond(this.put(identifier).send(this.normalizeBody(body)), callback);
};

ResourceClient.prototype.request = function (method, path) {
  const r = this.agent[method](path).type("json").accept("json");
  if (this.jwt) {
    r.set("Authorization", "JWT " + this.jwt);
  }
  return r;
};

ResourceClient.prototype.auth = function (id, password, callback) {
  const self = this;
  return respond(this.request("post", this.basePath + "/auth/jwt").send({
    username: id,
    password: password
  }), function (error, response) {
    if (error) {
      return callback(error);
    }

    self.jwt = response.body.jwt;
    return callback(null, self.jwt);
  });
};

ResourceClient.prototype.deauth = function () {
  this.jwt = null;
};

module.exports = exports = ResourceClient;
