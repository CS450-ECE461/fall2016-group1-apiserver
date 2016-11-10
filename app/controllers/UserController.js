var blueprint = require('@onehilltech/blueprint');
var ResourceController = require('./../../lib/ResourceController');
var User = require('../models/User');
var _ = require('lodash');

function UserController() {
    ResourceController.call(this, {
        model: User
    });
}

blueprint.controller(UserController, ResourceController);

//noinspection JSUnusedGlobalSymbols
UserController.prototype.showMe = function () {
    return function (req, res) {
        if (!req.user) {
            return res.status(401).json({error: 'Invalid Token.'});
        }
        res.json(req.user.toJSON());
    }
};

module.exports = UserController;
