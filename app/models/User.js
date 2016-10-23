var mongodb = require('@onehilltech/blueprint-mongodb');
var validator = require('validator');

var schema = new mongodb.Schema({
    _id: {
        unique: true,
        index: true,
        type: String,
        required: true,
        trim: true,
        validate: validator.isAlphanumeric
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
        required: true,
        trim: true,
        validate: validator.isEmail
    }
});

module.exports = exports = mongodb.model('User', schema);
