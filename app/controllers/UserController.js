var blueprint = require('@onehilltech/blueprint');
var ResourceController = require('./../../lib/ResourceController');
var User = require('../models/User');

function UserController () {
    ResourceController.call(this, {
        model: User
    });
}

blueprint.controller(UserController, ResourceController);


