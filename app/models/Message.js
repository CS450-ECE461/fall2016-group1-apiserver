var mongodb = require("@onehilltech/blueprint-mongodb");

var schema = new mongodb.Schema({
  sender: {
    type: mongodb.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  channel: {
    type: mongodb.Schema.Types.ObjectId,
    index: true,
    ref: "channels"
  },
  content: {
    type: String,
    trim: true,
    require: true
  },
  expireAt: {
    type: Date,
    required: true,
    min: Date.now()
  },
  seen: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
    // Adds 'createdAt' and 'updatedAt' fields
  timestamps: true
});

module.exports = exports = mongodb.model("messages", schema);
