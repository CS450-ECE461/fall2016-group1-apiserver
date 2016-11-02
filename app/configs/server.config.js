var handlebars = require('express-handlebars');
var helpers = require('handlebars-helpers');
var layouts = require('handlebars-layouts');

var hbs = handlebars.create({
    extname: '.hbs',
    defaultLayout: 'default',
    layoutsDir: 'app/views/layouts',
    partialsDir: 'app/views/partials',
    helpers : [helpers, layouts]
});

module.exports = exports = {
    protocols: {
        http: {
            port: 5000
        }
    },

    middleware: {
        validator: {},
        bodyParser: {
            urlencoded: {extended: false},
            json: {}
        },

        morgan: {
            format: 'dev',
            immediate: true
        },

        view_engine: 'hbs',
        engines: {
            'hbs': hbs.engine
        }
    }
};
