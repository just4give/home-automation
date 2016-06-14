/**
 * Created by appstacksoultions.com on 6/7/16.
 */

var mosca = require('mosca');
var User = require('./user');
var Crypto = require('./crypto');
var edisonStatus = false;


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

   // console.log(client.id,username,password.toString());

    User.findOne({ username: username }, function(err, user) {

        if (err || !user ){
            callback(null, false);
            return;
        } else{

            var hashedPassword = Crypto.hashPwd(user.salt, password.toString());

            var authorized = (hashedPassword === user.password);
            if (authorized) {
                client.user = user;
            }
            callback(null, authorized);
        }


    });

}

var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
    if(client.id ==='edison'){
        edisonStatus = true;
        server.publish({topic:'topic/edison/status', payload:'up'},function(){
            console.log("topic/edison/status notified with up status")
        });
    }
});

server.on('clientDisconnected', function(client) {
    console.log('client disconnected', client.id);
    if(client.id ==='edison'){
        edisonStatus = false;
        server.publish({topic:'topic/edison/status', payload:'down'},function(){
            console.log("topic/edison/status notified with down status")
        });
    }

});

// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running');
    server.authenticate = authenticate;

}


