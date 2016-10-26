var mongodb = require('@onehilltech/blueprint-mongodb');
var validator = require('validator');
var uuid = require('uuid');

var schema = new mongodb.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    secret: {
        type: String,
        required: true,
        default: uuid.v4
    },
    emailAddress: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: validator.isEmail
    },
    roles: {
        type: [String],
        required: true,
        default: []
    },
    redirectURL: {
        type: String,
        required: true,
        trim: true,
        validate: validator.isURL
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true
    },
    meta: {
        type: mongodb.Schema.Types.Mixed,
        default: {}
    }
});

module.exports = mongodb.model('clients', schema);
