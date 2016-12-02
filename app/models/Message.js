const mongodb = require("@onehilltech/blueprint-mongodb");
const Channel = require("../models/Channel");
const User = require("../models/User");

const schema = new mongodb.Schema({
  sender: {
    type: mongodb.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  channel: {
    type: mongodb.Schema.Types.Mixed,
    required: true,
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

schema.pre("validate", function (next) {
  const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

  const self = this;
  if (self.channel === undefined) { return next(new Error("Message Validation Error")); }
  if (!(checkForHexRegExp.test(self.channel))) {
    if (self.channel.hasOwnProperty("receiver")) {
      self.setReceivers([self.channel.receiver], next);
    } else if (self.channel.hasOwnProperty("receivers")) {
      self.setReceivers(self.channel.receivers, next);
    }
  } else {
    return next();
  }
});

schema.methods.setReceivers = function (array, next) {
  const receivers = [];
  let invalid = false;

  if (!(array.length > 0)) { return; }
  if (!(array instanceof Array)) {
    array = [array];
  }

  // Check each receiver, exit if any are not found
  let count = 0;
  const self = this;
  for (let id of array) {
    if (invalid) { return next(new Error("Invalid Receiver Reference")); }
    User.findById(id, function (error, result) {
      if (error) { return next(error); }
      if (!result) {
        invalid = true;
        return;
      }
      count++;
      if (!receivers.includes(result._id)) {
        receivers.push(result._id);
      }
      if ((count === array.length) && !invalid) {
        self.setChannel(receivers, next);
      }
    });
  }
};

schema.methods.setChannel = function (receivers, next) {
  // See if channel for receivers exists, create one if needed
  const members = receivers;
  members.push(this.sender);

  const self = this;
  Channel.findOne({ members: { $all: members, $size: members.length } }, function (error, result) {
    if (error) { throw error; }
    if (!result) {
      Channel.create({ members: members }, function (error, channel) {
        if (error) { throw error; }
        self.channel = channel._id;
        self.save();
        return next();
      });
    } else {
      self.channel = result._id;
      self.save();
      return next();
    }
  });
};

module.exports = exports = mongodb.model("messages", schema);
