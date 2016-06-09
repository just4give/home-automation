/**
 * Created by appstacksoultions.com on 6/7/16.
 */
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost:1983',{clientId:'edison',username:'edison',password:'password'});

client.on('error', function(err) {
    console.log("Error in connection ", err.message);
});
client.on('connect', function () {
    client.subscribe('topic/lamp/action');
    var status = true;
    setInterval(function(){
        status= !status;
        client.publish('topic/lamp/status', status?'on':'off');
    },1000);

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