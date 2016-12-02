const mongodb = require("@onehilltech/blueprint-mongodb");
const Schema = mongodb.Schema;
const validator = require("validator");

const schema = new Schema({
  handle: {
    type: String,
    required: false,
    trim: true,
    validate: [
      validator.isAlphanumeric,
      validator.isLowercase
    ]
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  emailAddress: {
    type: String,
    required: true,
    trim: true,
    validate: [
      validator.isEmail
    ]
  },
  location: {
    // alpha-3 Country Code
    country: {
      type: String,
      required: false,
      trim: true,
      minLength: 3,
      maxLength: 3,
      validate: [
        validator.isAlpha
      ]
    },
    // State, Province, etc.
    region: {
      type: String,
      required: false,
      trim: true
    },
    // City, town, etc.
    locality: {
      type: String,
      required: false,
      trim: true
    }
  }
}, {
  timestamps: true
});

module.exports = exports = mongodb.model("orgs", schema);
