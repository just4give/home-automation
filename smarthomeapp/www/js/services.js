angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('MQTTSocket',function(){

  var service={};
  var client={};

  service.connect = function(username,password,cb){
      client  = mqtt.connect('mqtt://',{clientId:'mobile',username:username,password:password});

      client.on('error', function(err) {
        console.log("Error in connection ", err.message);
        cb(err);
      });
      client.on('connect', function () {
        console.log('connected to MQTT broker');
        client.subscribe('topic/lamp/action');
        client.subscribe('topic/lamp/status');
        cb(null,true);

      });
      client.on('message', function (topic, message) {
        switch (topic){
          case 'topic/lamp/action':
                console.log("message received by mobile on topic/lamp/action", message.toString());
                break;
          case 'topic/lamp/status':
                console.log("message received by mobile on topic/lamp/status", message.toString());
                break;

        }

      });
  }

  service.publish = function(topic, payload) {
    client.publish(topic,payload, {retain: true});

  }




  return service;

});
