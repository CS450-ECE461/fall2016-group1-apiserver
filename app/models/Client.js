const mongodb = require("@onehilltech/blueprint-mongodb");
const validator = require("validator");
const uuid = require("uuid");

const schema = new mongodb.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  secret: {
    type: String,
    required: true,
    default: uuid.v4
  },
  emailAddress: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: validator.isEmail
  },
  scopes: {
    type: [String],
    required: false,
    default: []
  },
  website: {
    type: String,
    required: false,
    validate: validator.isURL
  },
  redirectURL: {
    type: String,
    required: true,
    trim: true,
    validate: validator.isURL
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  meta: {
    type: mongodb.Schema.Types.Mixed,
    default: {}
  }
});

module.exports = mongodb.model("clients", schema);
