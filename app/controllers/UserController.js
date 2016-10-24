var blueprint = require('@onehilltech/blueprint');
var mongodb = require('@onehilltech/blueprint-mongodb');
var ResourceController = mongodb.ResourceController;
var User = require('../models/User');

function UserController() {
    ResourceController.call(this, {
        name: "user",
        model: User
    });
}

blueprint.controller(UserController, ResourceController);

module.exports = exports = UserController;
