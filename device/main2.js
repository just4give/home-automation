/**
 * Created by appstacksoultions.com on 6/7/16.
 */
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://52.25.206.147:2983',{clientId:'edison',username:'edison',password:'password123'});

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

"use strict";

var cylon = require("cylon");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var net = require('net');
var mochad = net.createConnection(1099);
var mochadConnected = false;

cylon.robot({
    name: "doorbot",
    connections: {
        edison: { adaptor: "intel-iot" }
    },
    devices: {
        led: { driver: "led", pin: 13, connection: "edison" }
    },
    work: function() {

        var that = this;
        setInterval(function() {
            //console.log('toggling...');
            that.led.toggle();

        }, 1000);
    }
}).start();
/* /garage/a1/on */
app.get('/garage/:code/:mode', function(req, res) {
    if (mochadConnected) {
        console.log('Writing to Mochad');
        mochad.write('rf '+ req.params.code +' '+ req.params.mode+' \n');
        res.send('ok');
    }else{
        res.send('mochad not ruuning');
    }

})

mochad.on('connect', function() {
    console.log('Connected to Mochad');
    mochadConnected = true;
});

mochad.on('error', function() {
    console.log('Mochad connect error!');
});

http.listen(8000, function() {
    console.log('Web server started on port 8000');
});