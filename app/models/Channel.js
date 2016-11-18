var mongodb = require("@onehilltech/blueprint-mongodb");

var schema = new mongodb.Schema({
  members: {
    type: [{ type: mongodb.Schema.Types.ObjectId, ref: "users" }],
    index: true
  },
  meta: {
    type: mongodb.Schema.Types.Mixed,
    default: {}
  }
}, { toJSON: { virtuals: true } });

schema.virtual("messages", {
  ref: "messages",
  localField: "_id",
  foreignField: "channel"
});

schema.statics.getChannelsByUser = function (user, next) {
  this
    .find({ members: user._id })
    .populate("messages")
    .exec(function (err, channels) {
      if (err) { return next(err); }
      next(channels);
  });
};

module.exports = mongodb.model("channels", schema);
