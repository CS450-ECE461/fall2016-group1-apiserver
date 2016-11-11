var mongodb = require('@onehilltech/blueprint-mongodb');
var Schema = mongodb.Schema;
var validator = require('validator');
var uuid = require('uuid');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');

//noinspection JSUnresolvedVariable
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
        required: false
    },
    passwordHash: {
        type: String,
        required: false
    },
    createdBy: {
        type: mongodb.Schema.Types.ObjectId,
        index: true,
        required: false,
        ref: 'clients'
    },
    meta: {
        type: mongodb.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

schema.pre('save', function(next) {
    // If there is a password then the user has been created or
    // their password has been updated so we need to hash it
    if (this.password !== null) {
        this.passwordHash = bcrypt.hashSync(this.password);
        this.password = null;
    }
    
    next();
});

schema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.createToken = function () {
    return jwt.encode(this.id, 'mysecret');
};

schema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    delete obj.passwordHash;
    return obj;
};

module.exports = exports = mongodb.model('users', schema);
