var mongodb = require('@onehilltech/blueprint-mongodb');
var validator = require('validator');

var schema = new mongodb.Schema({
    sender: {
        type: String,
        required: true,
        ref: 'User'
    },
    receiver: {
        type: String,
        required: true,
        ref: 'User'
    },
    content: { 
        type: String, 
        trim: true
        require: true
    },
    timestamps: { updatedAt: 'expireAt' },
    seen: { type: Boolean, default: false }
});

module.exports = exports = mongodb.model('messages', schema);
