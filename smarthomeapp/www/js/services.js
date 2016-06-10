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

.factory('MQTTSocket',function($rootScope){

  var service={};
  var client={};

  service.connect = function(username,password,cb){
      client  = mqtt.connect('mqtt://52.25.206.147:2984',{clientId:'mobile',username:username,password:password});

      client.on('error', function(err) {
        console.log("Error in connection ", err.message);
        cb(err);
      });
      client.on('connect', function () {
        console.log('connected to MQTT broker');
        client.subscribe('topic/lamp/action');
        client.subscribe('topic/lamp/status');
        client.subscribe('topic/sensor/temp');
        cb(null,true);

      });
      client.on('message', function (topic, message) {
        switch (topic){
          case 'topic/lamp/action':

                break;
          case 'topic/lamp/status':

                break;
          case 'topic/sensor/temp':
                console.log("temp",message.toString());
                $rootScope.$apply(function(){

                  if($rootScope.labels.length >10){
                    $rootScope.labels.shift();
                    $rootScope.labels.push("");
                    $rootScope.data.shift();
                    $rootScope.data.push(message.toString());

                  }else{
                    $rootScope.labels.push("");
                    $rootScope.data.push(message.toString());
                  }
                  $rootScope.temperature= Math.round(Number(message.toString()));
                })

                break;

        }

      });
  }

  service.publish = function(topic, payload) {
    client.publish(topic,payload);

  }




  return service;

});
