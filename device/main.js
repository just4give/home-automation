/**
 * Created by appstacksoultions.com on 6/7/16.
 */
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost:2983',{clientId:'edison',username:'guest',password:'guest1'});

client.on('error', function(err) {
    console.log("Error in connection ", err.message);
});
client.on('connect', function () {
    client.subscribe('topic/lamp');
    client.publish('topic/lamp', 'on');
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log("Message received",message.toString());
    client.end();
});