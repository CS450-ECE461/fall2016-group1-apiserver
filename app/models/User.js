var mongodb = require('@onehilltech/blueprint-mongodb');
var Schema = mongodb.Schema;
var validator = require('validator');
var uuid = require('uuid');

//noinspection JSUnresolvedVariable
var schema = new Schema({
    username: {
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
        unique: true,
        index: true,
        required: 'Email Address is already being used by someone else',
        trim: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
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

module.exports = exports = mongodb.model('users', schema);
