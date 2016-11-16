var mongodb = require("@onehilltech/blueprint-mongodb");

var schema = new mongodb.Schema({
    members: {
        type: [{ type: mongodb.Schema.Types.ObjectId, ref: "users" }],
        index: true
    },
    messages: [{ type: mongodb.Schema.Types.ObjectId, ref: "messages" }],
    meta: {
        type: mongodb.Schema.Types.Mixed,
        default: {}
    }
});

module.exports = mongodb.model("channels", schema);
