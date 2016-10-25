var blueprint = require('@onehilltech/blueprint');

module.exports = {
    connections: {
        $default: {
            connstr: 'mongodb://mongo/' + blueprint.env,
            options: {
                db: {
                    w: 1,
                    socketOptions: {
                        keepAlive: 120
                    }
                },
                server: {
                    keepAlive: 1,
                    poolSize: 5,
                    socketOptions: {
                        autoReconnect: true,
                        noDelay: true,
                        keepAlive: 120,
                        connectTimeoutMS: 5000,
                        monitoring: true,
                        haInterval: 10000
                    }
                }
            }
        }
    }
};
