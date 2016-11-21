var mongodb = require("@onehilltech/blueprint-mongodb");
var Schema = mongodb.Schema;
var validator = require("validator");
var jwt = require("jwt-simple");
var bcrypt = require("bcrypt-nodejs");
var SALT_WORK_FACTOR = 10;

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

UserSchema.pre("save", function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
  });
});

schema.methods.verifyPassword = function(candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return next(err);
    return next(null, isMatch);
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
