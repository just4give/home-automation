/**
 * Created by appstacksoultions.com on 6/7/16.
 */

var mosca = require('mosca');

var mqttbackend = {
    //using ascoltatore
    type: 'mongo',
    url: 'mongodb://localhost:27017/mosca',
    pubsubCollection: 'pubsub',
    mongo: {}
};

var moscaSettings = {
    port: 2983,
    backend: mqttbackend,
    http: {
        port: 2984,
        bundle: true,
        static: './'
    },
    persistence: {
        factory: mosca.persistence.Mongo,
        url: 'mongodb://localhost:27017/mosca'
    }
};


var authenticate = function(client, username, password, callback) {
    var authorized = (username === 'guest' && password.toString() === 'guest');
    if (authorized) client.user = username;
    callback(null, authorized);
}

var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

server.on('clientDisconnected', function(client) {
    console.log('client disconnected', client.id);
});

// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running');
    server.authenticate = authenticate;

}


