const handlebars = require("express-handlebars");
const helpers = require("handlebars-helpers");
const layouts = require("handlebars-layouts");

const hbs = handlebars.create({
  extname: ".hbs",
  defaultLayout: "default",
  layoutsDir: "app/views/layouts",
  partialsDir: "app/views/partials",
  helpers: [helpers, layouts]
});

module.exports = exports = {
  protocols: {
    http: {
      port: 80
    }
  },

  middleware: {
    validator: {},
    bodyParser: {
      urlencoded: {extended: false},
      json: {}
    },

    morgan: {
      format: "dev",
      immediate: true
    },

    passport: {},

    view_engine: "hbs",
    engines: {
      "hbs": hbs.engine
    }
  }
};
