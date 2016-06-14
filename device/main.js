/**
 * Created by appstacksoultions.com on 6/7/16.
 */

"use strict";

var cylon = require("cylon");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var net = require('net');
var mochad = net.createConnection(1099);
var mochadConnected = false;

mochad.on('connect', function() {
    console.log('Connected to Mochad');
    mochadConnected = true;
});

mochad.on('error', function() {
    console.log('Mochad connect error!');
    mochadConnected = false;
});

cylon.robot({
    name: "doorbot",
    connections: {
        edison: { adaptor: "intel-iot" },
        server: { adaptor: 'mqtt', host: 'mqtt://52.25.206.147:2983', clientId:'edison',username:'xxxx',password:'xxxx' }
    },
    devices: {
        led: { driver: "led", pin: 13, connection: "edison" },
        temp: {driver: "temperature-sensor", pin: 0}
    },
    work: function() {

        var that = this;
        var fahrenheit;
        var a1lamp = false;
        
        every((3).second(), function() {
            
            fahrenheit = that.temp.celsius() * 9.0/5.0 + 32.0;
            //console.log(fahrenheit);
            that.server.publish('topic/sensor/temp', fahrenheit.toString());
            that.led.toggle();    
        });
        
        that.server.subscribe('topic/lamp/action');
        that.server.on('message', function (topic, message) {
          switch(topic){
              case 'topic/lamp/action':
                  mochad.write('rf a1 ' + message.toString()+' \n');
                  that.server.publish('topic/lamp/a1/status', message.toString(),{retain:true});
                  break;
          }
        });

    }
}).start();





