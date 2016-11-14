

module.exports = {
    "/v1": {
        "/auth": {
            "/jwt": {
                post: {action: "AuthController@login"}
            }
        }
    }
};
