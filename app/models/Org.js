var mongodb = require('@onehilltech/blueprint-mongodb');
var Schema = mongodb.Schema;
var validator = require('validator');

var locationSchema = new Schema({
    // City, town, etc.
    locality: {
        type: String,
        required: false,
        trim: true,
        validate: [
            validator.isAlphanumeric
        ]
    },
    // State, Province, etc.
    region: {
        type: String,
        required: false,
        trim: true,
        validate: [
            validator.isAlphanumeric
        ]
    },
    // alpha-3 Country Code
    country: {
        type: String,
        minLength: 3,
        maxLength: 3,
        validate: [
            validator.isAlpha
        ]
    }
});

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
    name: {
        type: String,
        required: true,
        trim: true,
        validate: [
            validator.isAlphanumeric
        ]
    },
    emailAddress: {
        type: String,
        required: true,
        trim: true,
        validate: [
            validator.isEmail
        ]
    },
    location: locationSchema

});
