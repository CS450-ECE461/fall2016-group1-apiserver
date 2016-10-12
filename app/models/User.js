var mongodb = require('@onehilltech/blueprint-mongodb');

var schema = new mongodb.Schema({
  firstName: {
      type: String,
      required: true,
      trim: true
  },
  lastName: {
      type: String,
      required: true,
      trim: true
  }
});

module.exports = exports = mongodb.model ('users', schema);
