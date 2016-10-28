var UserController = require('../../controllers/UserController');

module.exports = {
    '/v1': {
        '/users': {
            resource: {
                controller: 'UserController'//,
                //deny: ['getAll']
            }
        }
    }
};
