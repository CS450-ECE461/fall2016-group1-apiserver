const passport = require("passport");

// noinspection JSUnresolvedFunction
module.exports = {
  "/v1": {
    "/users": {
      resource: {
        controller: "UserController"
      },
      "/me": {
        post: {
          before: [passport.authenticate("jwt", {session: false})],
          action: "UserController@showMe"
        }
      }
    }
  }
};
