var passport = require('passport');

module.exports = {
    '/v1': {
        '/users': {
            resource: {
                controller: 'UserController'//,
                //deny: ['getAll']
            },
            '/me': {
                post: {
                    before: [passport.authenticate('jwt', { session: false })],
                    action: 'UserController@showMe'
                }
            }
        },
        '/auth': {
            '/jwt': {
                post: { action: 'LoginController@login' }
            }
        }
    }
};
