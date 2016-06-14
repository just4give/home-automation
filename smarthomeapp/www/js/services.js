angular.module('starter.services', [])


  .factory('MQTTSocket',function($rootScope,localStorageService){

    var service={};
    var client={};

    service.connect = function(username,password,cb){
      //console.log("connecting to mqtt", username, password);
      client  = mqtt.connect('mqtt://52.25.206.147:2984',{username:username,password:password});

      client.on('error', function(err) {
        //console.log("Error in connection ", err.message);
        client.end();
        if(cb){
          cb(err);
        }
      });

      client.on('reconnect',function(){
        //console.log("reconnecting");
      })


      client.on('connect', function () {
        //console.log('connected to MQTT broker');
        localStorageService.set('connected',true);
        localStorageService.set('username',username);
        localStorageService.set('password',password);
        client.subscribe('topic/lamp/action');
        client.subscribe('topic/lamp/a1/status');
        client.subscribe('topic/sensor/temp');


        if(cb){
          cb(null,true);
        }

      });
      client.on('message', function (topic, message) {
         service.callback(topic,message);

      });

    }

    service.publish = function(topic, payload) {
      client.publish(topic,payload);

    }

    service.onMessage = function(callback) {
      service.callback = callback;
    }

    service.disconnect = function(){
      client.end();
    }


    return service;

  })
  .factory('AuthService',function(localStorageService){

    return{
      isAuthorized: function(){
        return localStorageService.get('connected')? true:false;
      }
    }
  });
