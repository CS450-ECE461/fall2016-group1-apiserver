var handlebars = require('express-handlebars');
var helpers = require('handlebars-helpers');
var layouts = require('handlebars-layouts');

module.exports = function(blueprint) {
    var express = blueprint.server.app;
    var hbs = handlebars.create({
        extname: '.hbs',
        defaultLayout: 'default',
        layoutsDir: 'app/views/layouts',
        partialsDir: 'app/views/partials',
        helpers : [helpers, layouts]
    });

    express.enable('view cache');
    express.engine('hbs', hbs.engine);
    express.set('view engine', 'hbs');

};
