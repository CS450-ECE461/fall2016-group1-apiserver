var mongodb = require('@onehilltech/blueprint-mongodb');
var validator = require('validator');

var schema = new mongodb.Schema({
    sender: {
        type: String,
        required: true,
        ref: 'users'
    },
    receiver: {
        type: String,
        required: true,
        ref: 'users'
    },
    content: { 
        type: String, 
        trim: true
        require: true
    },
    expireAt: {
        type: Date,
        required: true
        min: Date.now()
    },
    seen: { 
        type: Boolean,
        required: true
        default: false 
    }
}, {
    // Adds 'createdAt' and 'updatedAt' fields
    timestamps: true
});

module.exports = exports = mongodb.model('messages', schema);
