var passport = require ('passport')
  ;

module.exports = {
  '/login': {
    get: {view: 'login.handlebars'},
    post: { action: 'LoginController@login' }
  },

  '/logout': {
    get: {action: 'LoginController@logout'}
  }
};
