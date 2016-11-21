var mongodb = require("@onehilltech/blueprint-mongodb");
var Channel = require("../models/Channel");
var User = require("../models/User");

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

schema.virtual("receivers").set(function (array) {
  var receivers = [];
  var invalid = false;

  if (!(array.size > 0)) { return; }
  if (!(array instanceof Array)) {
    array = [array];
  }

  // Check each receiver, exit if any are not found
  var count = 0;
  for (let id of array) {
    if (invalid) { return; }
    User.findByID(id, function (error, result) {
      if (error) { throw error; }
      if (!result) {
        invalid = true;
        return;
      }
      count++;
      if (!receivers.includes(result._id)) {
        receivers.push(result._id);
      }
      if ((count === array.length) && !invalid) {
        this.setChannel(receivers);
      }
    });
  };
});

schema.methods.setChannel = function (receivers) {
  // See if channel for receivers exists, create one if needed
  var self = this;
  Channel.findOne({ members: { $all: receivers } }, function (error, result) {
    if (error) { throw error; }
    if (!result) {
      Channel.create({ members: receivers }, function (error, channel) {
        if (error) { throw error; }
        self.channel = channel._id;
        self.save();
      });
    } else {
      self.channel = result._id;
      self.save();
    }
  });
};

module.exports = exports = mongodb.model("messages", schema);
