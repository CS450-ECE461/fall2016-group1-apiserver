var mongodb = require('@onehilltech/blueprint-mongodb');
var validator = require('validator');

var schema = new mongodb.Schema({
    _sender: {
        type: String,
        required: true,
        ref: 'User'
    },
    _receiver: {
        type: String,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true
    },
    durationSecs: {
        type: Number,
        required: true
    },
    creationTime: {
        type: Date,
        default: Date.now()
    },
    seen: {
        type: Boolean,
        default: false
    }
});

module.exports = exports = mongodb.model('Message', schema);
