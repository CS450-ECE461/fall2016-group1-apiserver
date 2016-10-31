var blueprint = require('@onehilltech/blueprint');

module.exports = {
    connections: {
        $default: {
            connstr: 'mongodb://localhost/prattle'
            //connstr: 'mongodb://mongo.bdfoster.com/450-team-1',
            //options: {
            //    db: {
            //        w: 1,
            //        socketOptions: {
            //            keepAlive: 120
            //        }
            //    },
            //    server: {
            //        keepAlive: 1,
            //        poolSize: 5,
            //        socketOptions: {
            //            autoReconnect: true,
            //            noDelay: true,
            //            keepAlive: 120,
            //            connectTimeoutMS: 5000,
            //            monitoring: true,
            //            haInterval: 10000
            //        },
            //        ssl: true,
            //        sslValidate: true
            //    },
            //    user: '450-team-1',
            //    pass: '43UsZyR94HsQqXU9'
            //}
        }
    }
};
