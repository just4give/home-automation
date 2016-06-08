/**
 * Created by appstacksoultions.com on 6/7/16.
 */
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost:2983',{clientId:'edison',username:'edison',password:'xxx'});

client.on('error', function(err) {
    console.log("Error in connection ", err.message);
});
client.on('connect', function () {
    client.subscribe('topic/lamp/action');

});

client.on('message', function (topic, message) {

    switch(topic){
        case "topic/lamp/action":
            var action = message.toString();
            //call MOCHAD to send signal to CM19A module, send the status back to topic
            client.publish('topic/lamp/status', 'on');
            break;
    }
});