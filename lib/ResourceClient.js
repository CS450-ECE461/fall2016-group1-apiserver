var pluralize = require("pluralize");
var superagent = require("superagent");

function respond (request, callback) {
  if (callback) {
    return request.end(callback);
  } else {
    return request;
  }
}

function ResourceClient (agent, name, version) {
  var host = null;

  if (agent instanceof String) {
    host = agent;
    agent = superagent();
  }

  this.agent = agent;
  this.name = name || null;

  if (!this.name) {
    throw new Error("'name' param must be specified");
  }

  this.version = version || 1;

  if (!isNaN(this.version)) {
    this.version = "v" + this.version;
  }

  this.plural = pluralize.plural(this.name);

  this.singular = pluralize.singular(this.plural);

  this.basePath = "/api/" + this.version + "/" + this.plural;

  if (this.host) {
    this.basePath = host + this.basePath;
  }
}

ResourceClient.prototype.compilePath = function (identifier) {
  var path = this.basePath;

  if (identifier) {
    path += "/" + identifier;
  }

  return path;
};

ResourceClient.prototype.normalizeBody = function (data) {
  var body = {};
  if (data.hasOwnProperty(this.singular)) {
    body = data;
  } else {
    body[this.singular] = data;
  }

  return body;
};

ResourceClient.prototype.get = function (identifier, callback) {
  return respond(this.agent.get(this.compilePath(identifier))
        .type("json")
        .set("Accept", "application/json"), callback);
};

ResourceClient.prototype.post = function (identifier, callback) {
  return respond(this.agent.post(this.compilePath(identifier))
        .type("json")
        .set("Accept", "application/json"), callback);
};

ResourceClient.prototype.put = function (identifier, callback) {
  return respond(this.agent.put(this.compilePath(identifier))
        .type("json")
        .set("Accept", "application/json"), callback);
};

ResourceClient.prototype.delete = function (identifier, callback) {
  if (identifier.hasOwnProperty("_id")) {
    identifier = identifier._id;
  }

  return respond(this.agent.delete(this.compilePath(identifier)), callback);
};

ResourceClient.prototype.create = function (body, callback) {
  return respond(this.post().type("json").send(this.normalizeBody(body)), callback);
};

ResourceClient.prototype.update = function (identifier, body, callback) {
  return respond(this.put(identifier).type("json").send(this.normalizeBody(body)), callback);
};

module.exports = exports = ResourceClient;
