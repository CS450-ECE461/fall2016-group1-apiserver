var blueprint = require('@onehilltech/blueprint');

var User;

blueprint.messaging.on('app.init', function (app) {
    User = app.models.User;
});

module.exports = exports = {
    protocols : {
        http : {
            port: 5000
        }
    },

    middleware : {
        validator  : { },
        bodyParser : {
            urlencoded : { extended: false },
            json : { }
        },

        morgan: {
            format: 'dev',
            immediate: true
        },

        passport: { }

    }
};
