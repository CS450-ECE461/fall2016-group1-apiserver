var mongodb = require('@onehilltech/blueprint-mongodb');
var Schema = mongodb.Schema;
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var uuid = require('uuid');

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

schema.pre('save', function(next) {
    var user = this;

    //noinspection JSUnresolvedFunction
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.hash(user.password, null, null, function(error, hash) {
        if (error) {
            return next(error);
        }

        user.password = hash;
        next();
    })
});

schema.methods.validatePassword = function(candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
        if (error) {
            return next(error);
        }

        next(null, isMatch);
    })
};



module.exports = exports = mongodb.model('users', schema);
