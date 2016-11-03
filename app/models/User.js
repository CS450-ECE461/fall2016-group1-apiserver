var mongodb = require('@onehilltech/blueprint-mongodb');
var Schema = mongodb.Schema;
var validator = require('validator');
var uuid = require('uuid');
var jwt = require('jwt-simple');

//noinspection JSUnresolvedVariable
var schema = new Schema({
    handle: {
        type: String,
        required: false,
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

schema.methods.verifyPassword = function (password) {
    return this.password === password;
};

schema.methods.createToken = function () {
    return jwt.encode(this.id, 'mysecret');
};

module.exports = exports = mongodb.model('users', schema);
