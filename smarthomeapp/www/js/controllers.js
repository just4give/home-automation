angular.module('starter.controllers', [])

  .controller('SignInCtrl', function($scope,$rootScope, $state,MQTTSocket,localStorageService) {

    $scope.signIn = function(user){

      MQTTSocket.connect(user.username,user.password,function(err,connected){

        if(err ){
          //console.log("Login failed");
          $scope.$apply(function(){
            $scope.error = err.message;
          });

        }else {
          //console.log("**connnected");
          $scope.error='';
          $state.go('tab.dash');


        }

      });
    }


  })
  .controller('DashCtrl', function($scope,$rootScope, $cordovaToast,MQTTSocket) {

    $scope.connectionError = false;
    $scope.temperature=0;
    $scope.labels = [];
    $scope.series = ['Temperature (F)'];
    $scope.data = [
      []
    ];

    $scope.tempColor = "#00ff00";
    $scope.settings = {
      livingRoomLight: true
    };

    $scope.$watch('temperature',function(newValue,oldValue){
      if(newValue > 80){
        $scope.tempColor="#E42112";
      }else if(newValue >40){
        $scope.tempColor="#F7885E";
      }else{
        $scope.tempColor="#0A9DC7";
      }
    })


    MQTTSocket.onMessage(function(topic, message) {
      //console.log('incoming topic: ' + topic + ' and payload: ' + message);
      switch (topic){
        case 'topic/lamp/action':

          break;
        case 'topic/lamp/a1/status':
              //console.log("lamp status:",message.toString());
              $scope.$apply(function() {
                if (message.toString() === 'on') {
                  $scope.settings.livingRoomLight = true;
                } else {
                  $scope.settings.livingRoomLight = false;
                }
              });

              break;
        case 'topic/sensor/temp':

          $scope.$apply(function(){

            if($scope.labels.length >30){
              $scope.labels.shift();
              $scope.labels.push("");
              $scope.data[0].shift();
              $scope.data[0].push(message.toString());

            }else{
              $scope.labels.push("");
              $scope.data[0].push(message.toString());
            }
            $scope.temperature= Math.round(Number(message.toString()));
          })

          break;

      }
    });

    $scope.commandLight = function(){

      /* $cordovaToast.showShortTop('Here is a message').then(function(success) {
       // success
       }, function (error) {
       // error
       });*/
      var command="";
      if( $scope.settings.livingRoomLight){
        command ="on";
      }else{
        command="off";
      }
      MQTTSocket.publish('topic/lamp/action',command);
    }


  })


  .controller('TabsCtrl', function($scope, $state, localStorageService,MQTTSocket) {

    $scope.logout = function(){
      localStorageService.clearAll();
      MQTTSocket.disconnect();
      $state.go('signin');
    }
  });
