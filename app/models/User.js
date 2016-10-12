var mongodb = require('@onehilltech/blueprint-mongodb');
var validator = require('validator');

var schema = new mongodb.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
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

module.exports = exports = mongodb.model ('users', schema);
