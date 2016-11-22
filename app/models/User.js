var mongodb = require("@onehilltech/blueprint-mongodb");
var Schema = mongodb.Schema;
var validator = require("validator");
var jwt = require("jwt-simple");
var bcrypt = require("bcrypt-nodejs");

// noinspection JSUnresolvedVariable
var schema = new Schema({
  handle: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    validate: [
      validator.isAlphanumeric,
      validator.isLowercase
    ]
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    validate: validator.isAlpha
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  emailAddress: {
    type: String,
    index: {
      unique: true
    },
    required: true,
    trim: true,
    validate: validator.isEmail
  },
  password: {
    type: String,
    required: false,
    sensitive: true
  },
  createdBy: {
    type: mongodb.Schema.Types.ObjectId,
    index: true,
    required: false,
    ref: "clients"
  },
  meta: {
    type: mongodb.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

schema.virtual("channels", {
  ref: "channels",
  localField: "_id",
  foreignField: "members"
});

schema.pre("save", function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  var self = this;
  bcrypt.hash(self.password, null, null, function (err, hash) {
    if (err) return next(err);
    self.password = hash;
    next();
  });
});

schema.methods.verifyPassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function (err, res) {
    if (err) return next(err);
    next(null, res);
  });
};

schema.methods.createToken = function () {
  return jwt.encode(this.id, "mysecret");
};

schema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = exports = mongodb.model("users", schema);
